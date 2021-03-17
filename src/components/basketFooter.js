import React  from 'react';
import Translate from '../translate';
import { getTotalPrice } from '../helpers';
import Link from '../components/Link';

const basketFooter = ({ basket_products }) => (
  <div className='footer-basket-icon-wrap header-right-link hidden-md-up'>
    <ul>
      <li className='cart-icon'>
        <Link to="/basket">
          <span className="cart-icon-main">
            <i className="fa fa-shopping-basket" />
            <small className="cart-notification">{basket_products.length}</small>
          </span>
          <div className="my-cart">
            <Translate W={'BASKET'} />
            <br />{getTotalPrice(basket_products)} <Translate W="AMD"/>
          </div>
        </Link>
      </li>
    </ul>
  </div>
);

export default basketFooter;
