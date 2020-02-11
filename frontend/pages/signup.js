import styled from 'styled-components';
import SignupForm from '../components/SignupForm.js';
import SigninForm from '../components/SigninForm.js';
import RequestReset from '../components/RequestReset.js';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const Signup = () => (
  <Columns>
    <SignupForm />
    <SigninForm />
    <RequestReset />
  </Columns>
);

export default Signup;
