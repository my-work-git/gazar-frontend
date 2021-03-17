import React from 'react';
import PropTypes from 'prop-types';
import Translate from '../../translate/index';

const Input = ({ label, labelClassName, className, value, changed, ...rest }) => {
  return (
    <React.Fragment>
      {label && (
        <label className={labelClassName}>
          <Translate W={label} />
        </label>
      )}
      <input {...rest} className={className} value={value} onChange={changed} />
    </React.Fragment>
  );
};

Input.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  changed: PropTypes.func,
};

export default Input;
