import ResetPasswordForm from '../components/ResetPasswordForm';

const resetPassword = ({ query }) => (
  <div>
    <ResetPasswordForm resetToken={query.resetToken} />
  </div>
);

export default resetPassword;
