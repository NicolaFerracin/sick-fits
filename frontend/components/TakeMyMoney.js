import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import calcTotalPrice from '../lib/calcTotalPrice';
import ErrorMessage from './ErrorMessage';
import User from './User';
import { CURRENT_USER_QUERY } from '../queries';
import { CREATE_ORDER_MUTATION } from '../mutations';

class TakeMyMoney extends Component {
  totalItems = cart => cart.reduce((acc, item) => acc + item.quantity, 0);

  onToken = async (res, createOrder) => {
    NProgress.start();
    const order = await createOrder({
      variables: { token: res.id },
    }).catch(err => alert(err.message));
    Router.push({
      pathname: '/order',
      query: { id: order.data.createOrder.id },
    });
  };

  render() {
    const { children } = this.props;
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {createOrder => (
              <StripeCheckout
                amount={calcTotalPrice(me.cart)}
                name="SickFits"
                description={`Order of ${this.totalItems(me.cart)} items`}
                image={
                  me.cart.length && me.cart[0].item && me.cart[0].item.image
                }
                stripeKey="pk_test_IqUWixldAKmVY25FalQjIQhw00ucxjsivn"
                currency="EUR"
                email={me.email}
                token={res => this.onToken(res, createOrder)}
              >
                {children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
