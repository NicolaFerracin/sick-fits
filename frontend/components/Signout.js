import { Mutation } from 'react-apollo';
import { SIGNOUT_MUTATION } from '../mutations';
import { CURRENT_USER_QUERY } from '../queries';
import ErrorMessage from './ErrorMessage';

const Signout = () => (
  <Mutation
    mutation={SIGNOUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signout, { error, loading }) => {
      if (error) return <ErrorMessage error={error} />;
      if (loading) return <p>Loading...</p>;
      return (
        <button type="button" onClick={signout}>
          Sign out
        </button>
      );
    }}
  </Mutation>
);

export default Signout;
