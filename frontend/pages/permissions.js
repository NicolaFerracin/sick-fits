import PermissionsTable from '../components/PermissionsTable';
import PleaseSignIn from '../components/PleaseSignIn';

const Permissions = () => (
  <div>
    <PleaseSignIn>
      <PermissionsTable />
    </PleaseSignIn>
  </div>
);

export default Permissions;
