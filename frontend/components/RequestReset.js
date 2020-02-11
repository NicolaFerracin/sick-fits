import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { REQUEST_RESET_MUTATION } from '../mutations';

class RequestReset extends Component {
  state = {
    email: '',
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = async (e, requestReset) => {
    e.preventDefault();
    await requestReset();
    this.setState({ email: '' });
  };

  render() {
    const { email } = this.state;

    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={{ email }}>
        {(requestReset, { error, loading, called }) => (
          <Form method="post" onSubmit={e => this.onSubmit(e, requestReset)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request a new password</h2>
              <ErrorMessage error={error} />
              {!error && !loading && called && (
                <p>Your request has been sent. Please check your email!</p>
              )}
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
              <button type="submit">Request</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default RequestReset;
