import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import SectionPanel from '../../components/UI/sectionPanel';
import { ProductsOrder } from '../../components/products';
import { SHOP_ORDERS } from '../../graph-ql';
import Translate from '../../translate';

@graphql(SHOP_ORDERS, { name: 'ordersQuery' })
class AccountOrders extends Component {
  state = {};

  render() {
    const { ordersQuery: { shopOrders, loading } } = this.props;

    return (
      <SectionPanel title="MY_ORDERS">
        { loading && <p className="text-center"><i className='fa fa-spinner fa-spin' style={{ fontSize: 25 }} /></p> }
        { !(shopOrders && shopOrders.length > 0) && <h5 className="text-center empty-orders-text"><i><Translate W="DONT_HAVE_ORDERS" /></i></h5> }
        {shopOrders && shopOrders.map(order => (
          <ProductsOrder key={order._id} created_at={order.created_at} price={order.price} deliveryTime={order.deliveryTime} products={order.products} />
        ))}
      </SectionPanel>
    );
  }
}

export default AccountOrders;
