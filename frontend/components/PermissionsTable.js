import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { ALL_USERS_QUERY } from '../queries';
import { UPDATE_PERMISSIONS_MUTATION } from '../mutations';
import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const PERMISSIONS = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMDELETE',
  'ITEMUPDATE',
  'PERMISSIONUPDATE',
];

const PermissionsTable = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        <ErrorMessage error={error} />
        <h2>Manage Permissions</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {PERMISSIONS.map(p => (
                <th key={p}>{p}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map(user => (
              <User key={user.id} user={user} />
            ))}
          </tbody>
        </Table>
      </div>
    )}
  </Query>
);

class User extends Component {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    permissions: this.props.user.permissions,
  };

  onPermissionChange = e => {
    const { permissions } = this.state;
    const { checked, value } = e.target;
    let newPermissions = [...permissions];
    if (checked) {
      newPermissions.push(value);
    } else {
      newPermissions = newPermissions.filter(p => p !== value);
    }
    this.setState({ permissions: newPermissions });
  };

  render() {
    const {
      user: { id, name, email },
    } = this.props;
    const { permissions } = this.state;

    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions,
          userId: id,
        }}
      >
        {(updatePermissions, { error, loading }) => (
          <>
            {error && (
              <tr>
                <th colSpan={8}>
                  <ErrorMessage error={error} />
                </th>
              </tr>
            )}
            <tr>
              <th>{name}</th>
              <th>{email}</th>
              {PERMISSIONS.map(p => (
                <th key={`user-${p}`}>
                  <label htmlFor={`${id}-permission-${p}`}>
                    <input
                      id={`${id}-permission-${p}`}
                      type="checkbox"
                      checked={permissions.includes(p)}
                      onChange={this.onPermissionChange}
                      value={p}
                    />
                  </label>
                </th>
              ))}
              <th>
                <SickButton
                  type="button"
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Update
                </SickButton>
              </th>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}

export default PermissionsTable;
