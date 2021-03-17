import React from 'react';
import PropTypes from 'prop-types';
import Translate from '../../../translate/index';

const SideBarCard = ({ title, description, iconImage }) => (
  <li className="service-box">
    <div className="feature-box ">
      {iconImage && <div className={`feature-icon ${iconImage}`} />}
      <div className="feature-detail">
        <div className="ser-title">{title && <Translate W={title} />}</div>
        <div className="ser-subtitle">{description && <Translate W={description} />}</div>
      </div>
    </div>
  </li>
);

SideBarCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  iconImage: PropTypes.string,
};

SideBarCard.defaultProps = {
  description: '',
  iconImage: '',
};

export default SideBarCard;
