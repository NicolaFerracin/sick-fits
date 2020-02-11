import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { SIGNIN_MUTATION } from '../mutations';
import { CURRENT_USER_QUERY } from '../queries';

class SigninForm extends Component {
  state = {
    email: '',
    password: '',
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = async (e, signin) => {
    e.preventDefault();
    await signin();
    this.setState({ email: '', password: '' });
  };

  render() {
    const { email, password } = this.state;

    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={{ email, password }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { error, loading }) => (
          <Form method="post" onSubmit={e => this.onSubmit(e, signin)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign up!</h2>
              <ErrorMessage error={error} />
              <label htmlFor="email">
                Email
                <input
                  type="text"
                  name="email"
                  placeholder="email"
                  value={email}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Sign in!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default SigninForm;
