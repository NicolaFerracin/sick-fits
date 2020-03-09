import formatMoney from '../lib/formatMoney';

describe('formatMoney', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(10)).toEqual('$0.10');
    expect(formatMoney(9)).toEqual('$0.09');
    expect(formatMoney(40)).toEqual('$0.40');
  });

  it('leaves cents off for whole dollars', () => {
    expect(formatMoney(5000)).toEqual('$50');
    expect(formatMoney(100)).toEqual('$1');
    expect(formatMoney(40000000)).toEqual('$400,000');
  });

  it('works with whole and fractional', () => {
    expect(formatMoney(456789)).toEqual('$4,567.89');
    expect(formatMoney(83883)).toEqual('$838.83');
  });
});
