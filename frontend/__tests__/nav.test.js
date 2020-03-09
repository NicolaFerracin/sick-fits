import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import Nav from '../components/Nav';
import { CURRENT_USER_QUERY } from '../queries';
import { fakeUser } from '../lib/testUtils';

const notSignedInMocks = [
  { request: { query: CURRENT_USER_QUERY }, result: { data: { me: null } } },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  },
];

describe('<Nav />', () => {
  it('renders minimal Nav when signed out', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const nav = wrapper.find('NavStyles');
    expect(toJSON(nav)).toMatchSnapshot();
  });

  it('renders full Nav when signed out', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const nav = wrapper.find('NavStyles');
    expect(toJSON(nav)).toMatchSnapshot();
  });
});
