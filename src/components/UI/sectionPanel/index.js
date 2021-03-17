import React from 'react';
import PropTypes from 'prop-types';
import Translate from '../../../translate/index';

const sectionPanel = ({ title, children, className }) => (
  <div className={`row m-0 ${className}`}>
    <div className="col-12 p-0">
      <div className="heading-part line-bottom mb-30">
        <h4 className="main_title heading">
          <span>
            <Translate W={title} />
          </span>
        </h4>
      </div>
      {children}
    </div>
  </div>
);

sectionPanel.propTypes = {
  title: PropTypes.any.isRequired,
};

export default sectionPanel;
