import { Query, Mutation } from 'react-apollo';
import Supreme from './styles/Supreme';
import SickButton from './styles/SickButton';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import { LOCAL_STATE_QUERY } from '../queries';
import { TOGGLE_CART_MUTATION } from '../mutations';

const Cart = () => (
  <Mutation mutation={TOGGLE_CART_MUTATION}>
    {toggleCart => (
      <Query query={LOCAL_STATE_QUERY}>
        {({ data }) => (
          <CartStyles open={data.cartOpen}>
            <header>
              <CloseButton title="close" onClick={toggleCart}>
                &times;
              </CloseButton>
              <Supreme>Your Cart</Supreme>
              <p>You have __ Items in your cart</p>
            </header>
            <footer>
              <p>__price__</p>
              <SickButton>Checkout</SickButton>
            </footer>
          </CartStyles>
        )}
      </Query>
    )}
  </Mutation>
);

export default Cart;
