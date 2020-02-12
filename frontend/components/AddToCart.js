import { Mutation } from 'react-apollo';
import { ADD_TO_CART_MUTATION } from '../mutations';

const AddToCart = ({ id }) => (
  <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ id }}>
    {addToCart => (
      <button type="button" onClick={addToCart}>
        Add to cart
      </button>
    )}
  </Mutation>
);

export default AddToCart;
