const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeNiceEmail } = require('../mail.js');
const { hasPermission } = require('../utils');
const stripe = require('../stripe');

const JWT_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 days
const RESET_PASSWORD_TOKEN_EXPIRATION = 1000 * 60 * 60; // 1 hour

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must logged in to perform this action.');
    }
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
          user: { connect: { id: ctx.request.userId } },
        },
      },
      info
    );
    return item;
  },
  updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{ id title user { id } }`);
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(p =>
      ['ADMIN', 'ITEMDELETE'].includes(p)
    );

    if (ownsItem || hasPermissions) {
      return ctx.db.mutation.deleteItem({ where }, info);
    }

    throw new Error("You don't have permissions to delete this item");
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      { data: { ...args, password, permissions: { set: ['USER'] } } },
      info
    );
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: JWT_EXPIRATION,
    });
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}.`);
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password');
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: JWT_EXPIRATION,
    });
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'User logged out successfully.' };
  },
  async requestReset(parent, { email }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}.`);
    }
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + RESET_PASSWORD_TOKEN_EXPIRATION;
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });
    const mailRes = await transport.sendMail({
      from: 'nicola@example.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeNiceEmail(
        `Your Password Reset Token is here!\n\n<a href="${process.env.FRONTEND_URL}/resetPassword?resetToken=${resetToken}">Click here to reset your password</a>`
      ),
    });

    return { message: 'Done' };
  },
  async resetPassword(parent, args, ctx, info) {
    const { resetToken, password, confirmPassword } = args;
    if (password !== confirmPassword) {
      throw new Error('Password and confirmed password do not match.');
    }
    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - RESET_PASSWORD_TOKEN_EXPIRATION,
      },
    });
    if (!user) {
      throw new Error('This token is either invalid or expired.');
    }
    const newPassword = await bcrypt.hash(args.password, 10);
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: JWT_EXPIRATION,
    });
    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be logged in to continue');
    }
    const user = await ctx.db.query.user({ where: { id: userId } }, info);
    console.log({ user });
    hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE']);
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info
    );
  },
  async addToCart(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be logged in!');
    }
    const [cartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      },
    });
    if (cartItem) {
      return ctx.db.mutation.updateCartItem(
        {
          data: { quantity: cartItem.quantity + 1 },
          where: { id: cartItem.id },
        },
        info
      );
    }
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: { connect: { id: userId } },
          item: { connect: { id: args.id } },
        },
      },
      info
    );
  },
  async removeFromCart(parent, { id }, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be logged in!');
    }
    const cartItem = await ctx.db.query.cartItem(
      {
        where: { id },
      },
      `{ id, user { id }}`
    );
    if (!cartItem) {
      throw new Error("We couldn't find the item you are trying to delete");
    }
    if (cartItem.user.id !== userId) {
      throw new Error("You can't delete this item");
    }
    return ctx.db.mutation.deleteCartItem({ where: { id } }, info);
  },
  async createOrder(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be logged in!');
    }
    const user = await ctx.db.query.user(
      { where: { id: userId } },
      `{ id name email cart { id quantity item { title price id description image largeImage } } }`
    );
    const amount = user.cart.reduce(
      (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
      0
    );
    const charge = await stripe.charges.create({
      amount,
      currency: 'EUR',
      source: args.token,
    });
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        user: { connect: { id: userId } },
      };
      delete orderItem.id;
      return orderItem;
    });
    const order = await ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: userId } },
      },
    });
    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    await ctx.db.mutation.deleteManyCartItems({
      where: { id_in: cartItemIds },
    });
    return order;
  },
};

module.exports = Mutations;
