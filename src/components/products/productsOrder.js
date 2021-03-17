import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import Translate from '../../translate';
import Button from '../common/button';
import { calcPrices } from '../../helpers';
import { addProductToBasket } from '../../store/action';

moment.suppressDeprecationWarnings = true;

class productsOrder extends Component {
  state = {
    showProducts: false,
  };

  orderAgain = () => {
    const { products, addProductToBasket } = this.props;
    products.map(p => addProductToBasket(p));
    this.props.history.replace('/basket');
  };

  render() {
    const { showProducts } = this.state;
    const { price, created_at, products, deliveryTime } = this.props;
    return (
      <div className="orders-item">
        <h6 className="float-right">
          {price}<Translate W="AMD"/>
          <div style={{ marginTop: 5 }}>
            <Button className="btn-info btn-sm" onClick={this.orderAgain}><Translate W="ORDER_AGAIN"/></Button>
          </div>
        </h6>
        <h4 onClick={() => this.setState({ showProducts: !showProducts })}>
          <Translate W={deliveryTime} /> ({products ? products.length : 0})
          <div>
            <small>{moment(created_at).format('HH:mm DD.MM.YYYY')}</small>
          </div>
        </h4>
        <div className={`orders-item-arrow text-center ${showProducts ? 'show-border' : ''}`}>
          <i className={`fa fa-angle-${showProducts ? 'up' : 'down'}`} />
        </div>
        {showProducts && (
          <div className="products-list">
            {products && products.map((product, i) => (
                <div key={product._id} className="ordered-product-item">
                  {i > 0 && <hr style={{ margin: '20px 0' }} />}
                  <h6 className="float-right">
                    {calcPrices(product.price, product.discount, product.quantity).price}
                    <Translate W="AMD" />
                  </h6>
                  <h6>
                    <Translate object={product} keyPrefix="name" /> - {`${product.quantity} `}
                    <Translate W={product.unit.toUpperCase()} />
                  </h6>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }
}

const mapDispatch = dispatch => ({
  addProductToBasket: product => dispatch(addProductToBasket(product)),
});

export default connect(
  () => ({}),
  mapDispatch,
)(withRouter(productsOrder));
