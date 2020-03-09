import { shallow } from 'enzyme';
import Item from '../components/Item';

const fakeItem = {
  id: 'ASDUYVB',
  title: 'Fake Item',
  price: 56890,
  description: 'Fake description',
  image: 'cat.jpg',
  largeImage: 'chonker.jpg',
};

describe('<Item />', () => {
  it('renders the image properly', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    const img = wrapper.find('img');
    expect(img.props().src).toBe(fakeItem.image);
    expect(img.props().alt).toBe(fakeItem.title);
  });

  it('renders the priceTag and title properly', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    const priceTag = wrapper.find('PriceTag');
    expect(priceTag.children().text()).toBe('$568.90');
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });

  it('renders out the buttons properly', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link').exists()).toBe(true);
    expect(buttonList.find('AddToCart').exists()).toBe(true);
    expect(buttonList.find('DeleteItem').exists()).toBe(true);
  });
});
