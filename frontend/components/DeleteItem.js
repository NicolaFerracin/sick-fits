import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { ALL_ITEMS_QUERY } from './queries';
import { DELETE_ITEM_MUTATION } from './mutations';

class DeleteItem extends Component {
  attemptDelete = deleteItem => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem();
    }
  };

  update = (cache, payload) => {
    // after deleting an item on the server, we need to update the local cache
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter(i => i.id !== payload.data.deleteItem.id);
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    const { id, children } = this.props;
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button type="button" onClick={() => this.attemptDelete(deleteItem)}>
            {children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
