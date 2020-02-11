import { Query } from 'react-apollo';
import SigninForm from './SigninForm';
import { CURRENT_USER_QUERY } from '../queries';

const PleaseSignIn = ({ children }) => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!data.me)
        return (
          <div>
            <p>Please sign in before continuing</p>
            <SigninForm />
          </div>
        );
      return children;
    }}
  </Query>
);

export default PleaseSignIn;
