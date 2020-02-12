import { Query, Mutation } from 'react-apollo';
import Supreme from './styles/Supreme';
import SickButton from './styles/SickButton';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import CartItem from './CartItem';
import User from './User';
import { LOCAL_STATE_QUERY } from '../queries';
import { TOGGLE_CART_MUTATION } from '../mutations';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

const Cart = () => (
  <User>
    {({ data: { me } }) =>
      me && (
        <Mutation mutation={TOGGLE_CART_MUTATION}>
          {toggleCart => (
            <Query query={LOCAL_STATE_QUERY}>
              {({ data }) => (
                <CartStyles open={data.cartOpen}>
                  <header>
                    <CloseButton title="close" onClick={toggleCart}>
                      &times;
                    </CloseButton>
                    <Supreme>{me.name} Cart</Supreme>
                    <p>You have {me.cart.length} Items in your cart</p>
                  </header>
                  <ul>
                    {me.cart.map(cartItem => (
                      <CartItem key={cartItem.id} cartItem={cartItem} />
                    ))}
                  </ul>
                  <footer>
                    <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                    <SickButton>Checkout</SickButton>
                  </footer>
                </CartStyles>
              )}
            </Query>
          )}
        </Mutation>
      )
    }
  </User>
);

export default Cart;
