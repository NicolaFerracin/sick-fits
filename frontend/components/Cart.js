import { Query, Mutation } from 'react-apollo';
import { adopt } from 'react-adopt';
import Supreme from './styles/Supreme';
import SickButton from './styles/SickButton';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import CartItem from './CartItem';
import User from './User';
import TakeMyMoney from './TakeMyMoney';
import { LOCAL_STATE_QUERY } from '../queries';
import { TOGGLE_CART_MUTATION } from '../mutations';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});

const Cart = () => (
  <Composed>
    {({ user, toggleCart, localState }) => {
      const { me } = user.data;
      return (
        me && (
          <CartStyles open={localState.data.cartOpen}>
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
              <TakeMyMoney>
                <SickButton>Checkout</SickButton>
              </TakeMyMoney>
            </footer>
          </CartStyles>
        )
      );
    }}
  </Composed>
);

export default Cart;
