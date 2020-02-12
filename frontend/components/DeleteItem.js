import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { ALL_ITEMS_QUERY } from '../queries';
import { DELETE_ITEM_MUTATION } from '../mutations';
import { perPage } from '../config';

class DeleteItem extends Component {
  attemptDelete = deleteItem => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem().catch(e => alert(e.message));
    }
  };

  update = (cache, payload) => {
    // after deleting an item on the server, we need to update the local cache
    const { page: currentPage } = this.props;
    const variables = { skip: (currentPage - 1) * perPage };
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY, variables });
    data.items = data.items.filter(i => i.id !== payload.data.deleteItem.id);
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data, variables });
  };

  render() {
    const { id, children } = this.props;
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={this.update}
      >
        {deleteItem => (
          <button type="button" onClick={() => this.attemptDelete(deleteItem)}>
            {children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
