import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import Link from '../Link';

import Translate from '../../translate/index';

const LinkHolder = ({ title, items, location }) => (
  <div className="account-sidebar account-tab mb-sm-30">
    <div className="dark-bg tab-title-bg">
      <div className="heading-part">
        <div className="sub-title"><Translate W={title}/></div>
      </div>
    </div>
    <div className="account-tab-inner">
      <ul className="account-tab-stap">
        {items &&
          items.map(item => (
            <li key={item.to} className={classNames({ active: location.pathname === item.to })}>
              <Link to={item.to}>
                <Translate W={item.text} /> <i className="fa fa-angle-right" />
              </Link>
            </li>
          ))}
      </ul>
    </div>
  </div>
);

LinkHolder.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  items: PropTypes.array.isRequired,
  location: PropTypes.object,
};

export default withRouter(LinkHolder);
