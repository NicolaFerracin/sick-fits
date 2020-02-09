import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';
import PagionationStyles from './styles/PaginationStyles';
import { PAGINATION_QUERY } from '../queries';
import { perPage } from '../config';

const Pagination = ({ page }) => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      const { count } = data.itemsConnection.aggregate;
      const pages = Math.ceil(count / perPage);
      return (
        <PagionationStyles>
          <Head>
            <title>
              Sick Fits | Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: '/items',
              query: { page: page - 1 },
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              ◀ Prev
            </a>
          </Link>
          <p>
            Page {page} of {pages}
          </p>
          <p>{count} Total Items</p>
          <Link
            prefetch
            href={{
              pathname: '/items',
              query: { page: page + 1 },
            }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Next ▶
            </a>
          </Link>
        </PagionationStyles>
      );
    }}
  </Query>
);

export default Pagination;
