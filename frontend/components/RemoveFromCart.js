import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import { REMOVE_FROM_CART_MUTATION } from '../mutations';
import { CURRENT_USER_QUERY } from '../queries';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

class RemoveFromCart extends Component {
  update = (cache, payload) => {
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    const { id } = payload.data.removeFromCart;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== id);
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };

  onRemoveItem = removeFromCart => {
    removeFromCart().catch(err => alert(err.message));
  };

  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id,
          },
        }}
      >
        {(removeFromCart, { loading }) => (
          <BigButton
            type="button"
            onClick={() => this.onRemoveItem(removeFromCart)}
            disabled={loading}
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
