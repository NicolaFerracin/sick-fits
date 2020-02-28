import Link from 'next/link';
import { Mutation } from 'react-apollo';
import NavStyles from './styles/NavStyles';
import User from './User';
import { TOGGLE_CART_MUTATION } from '../mutations';
import Signout from './Signout';
import CartCount from './CartCount';

const Nav = () => (
  <User>
    {({ data: { me } }) => {
      const totalItemsCount = me
        ? me.cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)
        : null;
      return (
        <NavStyles>
          <Link href="/items">
            <a>Items</a>
          </Link>
          {me ? (
            <>
              <Link href="/sell">
                <a>Sell</a>
              </Link>
              <Link href="/orders">
                <a>Orders</a>
              </Link>
              <Link href="/me">
                <a>Account</a>
              </Link>
              <Signout />
              <Mutation mutation={TOGGLE_CART_MUTATION}>
                {toggleCart => (
                  <button type="button" onClick={toggleCart}>
                    Cart
                    <CartCount count={totalItemsCount} />
                  </button>
                )}
              </Mutation>
            </>
          ) : (
            <Link href="/signup">
              <a>Sign in</a>
            </Link>
          )}
        </NavStyles>
      );
    }}
  </User>
);

export default Nav;
