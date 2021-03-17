import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Translate from '../../../translate/index';

const Categories = ({ categories }) => (
  <div id="cat" className="cat-dropdown">
    <div className="sidebar-content">
      <div id="menu" className="navbar-collapse menu-open">
        <div className="top-right-link mobile right-side ">
          <ul>
            <li className="login-icon">
              <NavLink to="/login">
                <span>
                  <i className="fa fa-lock" />
                </span>
              </NavLink>
            </li>
            <li className="account-icon">
              <NavLink to="/account">
                <span>
                  <i className="fa fa-user" />
                </span>
              </NavLink>
            </li>
            <li className="wishlist-icon">
              <NavLink to="/account/orders">
                <span>
                  <i className="fa fa-heart" />
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
        <ul className="nav navbar-nav ">
          {categories &&
            categories.map(category => (
              <li className="level" key={category._id}>
                <NavLink to={`/shop?cat=${category.slug}`} className="page-scroll category-link">
                  <Translate object={category} keyPrefix="name" />
                </NavLink>
              </li>
            ))}
        </ul>
      </div>
    </div>
  </div>
);

Categories.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default Categories;
