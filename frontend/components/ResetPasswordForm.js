import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { RESET_PASSWORD_MUTATION } from '../mutations';
import { CURRENT_USER_QUERY } from '../queries';

class ResetPasswordForm extends Component {
  state = {
    password: '',
    confirmPassword: '',
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = async (e, resetPassword) => {
    e.preventDefault();
    await resetPassword();
    this.setState({ confirmPassword: '', password: '' });
  };

  render() {
    const { confirmPassword, password } = this.state;
    const { resetToken } = this.props;

    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{ confirmPassword, password, resetToken }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetPassword, { error, loading }) => (
          <Form method="post" onSubmit={e => this.onSubmit(e, resetPassword)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Set new password</h2>
              <ErrorMessage error={error} />
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
              <label htmlFor="confirmPassword">
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Send</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default ResetPasswordForm;
