import { Mutation } from 'react-apollo';
import { ADD_TO_CART_MUTATION } from '../mutations';
import { CURRENT_USER_QUERY } from '../queries';

const AddToCart = ({ id }) => (
  <Mutation
    mutation={ADD_TO_CART_MUTATION}
    variables={{ id }}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(addToCart, { loading }) => (
      <button type="button" onClick={addToCart} disabled={loading}>
        Add to cart
      </button>
    )}
  </Mutation>
);

export default AddToCart;
