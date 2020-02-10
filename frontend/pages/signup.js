import styled from 'styled-components';
import SignupForm from '../components/SignupForm.js';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const Signup = () => (
  <Columns>
    <SignupForm />
    <SignupForm />
    <SignupForm />
  </Columns>
);

export default Signup;
