import styled from 'styled-components';
import SignupForm from '../components/SignupForm.js';
import SigninForm from '../components/SigninForm.js';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const Signup = () => (
  <Columns>
    <SignupForm />
    <SigninForm />
  </Columns>
);

export default Signup;
