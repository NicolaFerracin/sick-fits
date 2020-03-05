const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (userId) {
      return ctx.db.query.user({ where: { id: userId } }, info);
    }
    return null;
  },
  async users(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be logged in');
    }
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    // check logged in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be logged in');
    }
    // query current order
    const order = await ctx.db.query.order({ where: { id: args.id } }, info);
    // check permissions on order
    const ownsOrder = order.user.id === userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      'ADMIN'
    );
    // return order
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error('You can see this information');
    }
    return order;
  },
};

module.exports = Query;
