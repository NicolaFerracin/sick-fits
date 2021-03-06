import React, { Component } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import Pagination from './Pagination';
import Item from './Item';
import { ALL_ITEMS_QUERY } from '../queries';
import { perPage } from '../config';

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class Items extends Component {
  render() {
    const { page } = this.props;
    const skip = page * perPage - perPage;

    return (
      <Center>
        <Pagination page={page} />
        <Query query={ALL_ITEMS_QUERY} variables={{ skip }}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            return (
              <ItemsList>
                {data.items.map(item => (
                  <Item key={item.id} item={item} page={page} />
                ))}
              </ItemsList>
            );
          }}
        </Query>
        <Pagination page={page} />
      </Center>
    );
  }
}

export default Items;
