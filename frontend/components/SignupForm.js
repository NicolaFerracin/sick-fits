import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { SIGNUP_MUTATION } from '../mutations';

class SignupForm extends Component {
  state = {
    email: '',
    name: '',
    password: '',
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = async (e, signup) => {
    e.preventDefault();
    await signup();
    this.setState({ email: '', name: '', password: '' });
  };

  render() {
    const { email, name, password } = this.state;

    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={{ email, name, password }}
      >
        {(signup, { error, loading }) => (
          <Form method="post" onSubmit={e => this.onSubmit(e, signup)}>
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
              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="name"
                  value={name}
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
              <button type="submit">Sign up!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default SignupForm;
