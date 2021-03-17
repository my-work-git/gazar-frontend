import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Sticky } from 'react-sticky';
import Link from '../../Link';
import Translate from '../../../translate/index';
import SearchElement from './searchElement';
import Categories from './categories';
import { getTotalPrice, isDesktop } from '../../../helpers';

class HeaderBottom extends Component {
  state = {
    categoriesToggle: false,
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.detectClick);
  }

  detectClick = () => {
    const sidebar = document.getElementsByClassName('sideBar');
    if (sidebar) {
      sidebar[0].style.marginTop = '0';
    }
    this.setState({ categoriesToggle: false });
    document.removeEventListener('click', this.detectClick);
  };

  searchSubmitHandler = (category, value) => {
    console.log(category, value);
  };

  showCategories = () => {
    const newVal = !this.state.categoriesToggle;
    if (newVal) {
      document.addEventListener('click', this.detectClick);
    } else {
      document.removeEventListener('click', this.detectClick);
    }

    this.setState({ categoriesToggle: newVal });
  };

  renderRightSide = ({ basket_products }) => {
    return (
      <div className="col-xl-4 col-lg-3 bottom-part col-lgmd-20per">
        <div className="right-side float-left-xs header-right-link">
          <ul>
            <li className="cart-icon">
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
            <li className="side-toggle">
              <button className="navbar-toggle" type="button" onClick={this.showCategories}>
                <i className="fa fa-bars" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  baseHeaderRender = ({ style }, { fixCategories, categories }) => (
    <div className="header-bottom" style={style}>
      <div className="container">
        <div className="header-line">
          <div className="row position-r">
            <div className="col-xl-2 col-lg-3 bottom-part col-lgmd-20per position-initial">
              <div className="sidebar-menu-dropdown home">
                <div
                  className="btn-sidebar-menu-dropdown"
                  onClick={fixCategories ? () => {} : this.showCategories}
                >
                  <i className="fa fa-bars" />
                  <Translate W={'CATEGORIES'} />
                </div>
                {(fixCategories || this.state.categoriesToggle) && (
                  <Categories categories={categories} />
                )}
              </div>
            </div>
            <SearchElement submitHandler={this.searchSubmitHandler} categories={categories} />
            {this.renderRightSide(this.props)}
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    if (isDesktop()) {
      return (
        <Sticky topOffset={140}>
          {(options) => this.baseHeaderRender(options, this.props)}
        </Sticky>
      );
    }

    return this.baseHeaderRender({}, this.props);
  }
}

HeaderBottom.propTypes = {
  fixCategories: PropTypes.bool,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
};

HeaderBottom.defaultProps = {
  fixCategories: false,
};

export default HeaderBottom;
