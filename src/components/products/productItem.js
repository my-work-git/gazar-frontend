import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Translate from '../../translate';
import Input from '../../components/common/input';
import QuantityInput from './quantityInput';
import Button from '../../components/common/button';
import { calcPrices } from '../../helpers';
import Link from '../Link';

class Product extends Component {
  state = {
    quantity: 0,
  };

  componentDidMount() {
    this.setInitialQuantity(this.props.product);
  }

  componentWillReceiveProps(nextProps) {
    const { basketItem } = this.props;
    if (basketItem) {
      this.setInitialQuantity(nextProps.product);
    }
  }

  setInitialQuantity = product => {
    if (!product) return;
    const { minOrder, quantity } = product;
    if (quantity && quantity > 0) {
      this.setState({ quantity });
    } else {
      this.setState({ quantity: minOrder });
    }
  };

  changeHandler = event => {
    const { onQuantityChange } = this.props;
    if (onQuantityChange) {
      onQuantityChange(event.target.value);
    } else {
      this.setState({ quantity: event.target.value });
    }
  };

  addToBasket = () => {
    const { product, addToBasket: onAddToBasket, basketItem } = this.props;
    if (basketItem) return;

    const { quantity } = this.state;
    onAddToBasket && onAddToBasket({ ...product, quantity });
  };

  removeFromBasket = id => () => this.props.onRemoveFromBasket(id);

  renderPriceBlock = ({ product }) => {
    const { minOrder: quantityStep, maxOrder, price: productPrice, discount: productDiscount } = product;
    const { quantity } = this.state;
    const { price, discount } = calcPrices(productPrice, productDiscount, quantity);
    const inputConfig = {
      type: 'range',
      min: quantityStep,
      max: maxOrder,
      step: quantityStep,
    };

    return (
      <div>
        <div className="d-flex align-items-center justify-content-center range-slider-box">
          {/* <Input
            className={'slider'}
            value={quantity.toString()}
            {...inputConfig}
            changed={this.changeHandler}
          /> */}
          <QuantityInput quantityStep={quantityStep} onChange={value => this.changeHandler({ target: { value } })} value={quantity} />
        </div>
        <div className="price-box block">
          <span className="price">
            {price}
            <Translate W={'AMD'} />
          </span>
          <del className="price old-price">
            {productDiscount && productDiscount > 0 ? (
              <span>
                {discount} <Translate W={'AMD'} />
              </span>
            ) : null}
          </del>
        </div>
      </div>
    );
  };

  renderInfo = ({ product }) => {
    const { unit } = product;
    const { quantity } = this.state;
    return (
      <div>
        <div className="product-item-name">
          <Link to={`/shop/product/${this.props.product._id}`}>
            <h4 className="cursor-pointer">
              <Translate object={product} keyPrefix="name" />
            </h4>
          </Link>
        </div>
        <div className="unit_quantity">
          {quantity} {unit && <Translate W={unit.toUpperCase()} />}
        </div>
      </div>
    );
  };

  render() {
    const { basketItem, inBasket, product, noBorder } = this.props;
    const { photo } = product;

    return (
      <div className={`product-item ${noBorder ? 'border-0' : ''}`}>
        {inBasket && (
          <div className="main-label sale-label">
            <i className="fa fa-check" />
          </div>
        )}
        {!basketItem && [
          <Link key={1} to={`/shop/product/${product._id}`}>
            <div className="product-image">
              <img src={photo} />
            </div>
          </Link>,
          <div key={2}>&nbsp;</div>,
          <hr key={3} />,
        ]}
        <div className="product-item-details" style={{ padding: basketItem && '10px 15px' }}>
          {basketItem ? (
            <div className="row basket-item-row">
              <div className="col-md-2">
                <div className="product-image">
                  <img src={photo} />
                </div>
              </div>
              <div className="col-md-5">{this.renderInfo(this.props)}</div>
              <div className="col-md-5">
                {this.renderPriceBlock(this.props)}
                <div>&nbsp;</div>
                <a className='pull-right' onClick={this.removeFromBasket(product._id)}><i className='fa fa-trash'/> <Translate W='REMOVE'/></a>
              </div>
            </div>
          ) : (
            <div>
              {this.renderInfo(this.props)}
              {this.renderPriceBlock(this.props)}
              <Button className={'product-add-btn'} onClick={this.addToBasket}>
                <Translate W={'ADD'} /> <i className="fa  fa-shopping-basket" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Product.propTypes = {
  product: PropTypes.object,
  addToBasket: PropTypes.func,
  onRemoveFromBasket: PropTypes.func,
  basketItem: PropTypes.bool,
  inBasket: PropTypes.bool,
};

export default withRouter(Product);
