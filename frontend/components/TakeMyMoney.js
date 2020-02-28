import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import calcTotalPrice from '../lib/calcTotalPrice';
import ErrorMessage from './ErrorMessage';
import User from './User';

class TakeMyMoney extends Component {
  totalItems = cart => cart.reduce((acc, item) => acc + item.quantity, 0);

  onToken = res => {
    console.log(res);
  };

  render() {
    const { children } = this.props;
    return (
      <User>
        {({ data: { me } }) => (
          <StripeCheckout
            amount={calcTotalPrice(me.cart)}
            name="SickFits"
            description={`Order of ${this.totalItems(me.cart)} items`}
            image={me.cart[0].item && me.cart[0].item.image}
            stripeKey="pk_test_IqUWixldAKmVY25FalQjIQhw00ucxjsivn"
            currency="EUR"
            email={me.email}
            token={res => this.onToken(res)}
          >
            {children}
          </StripeCheckout>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
