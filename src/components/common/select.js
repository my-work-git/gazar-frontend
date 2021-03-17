import React from 'react';
import PropTypes from 'prop-types';
import Translate from '../../translate/index';

const Select = ({ label, labelClassName, elementConfig, className, value, changed, options }) => (
  <React.Fragment>
    {label && (
      <label className={labelClassName}>
        <Translate W={label} />
      </label>
    )}
    <select {...elementConfig} className={className} value={value} onChange={changed}>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          <Translate W={option.name} />
        </option>
      ))}
    </select>
  </React.Fragment>
);

Select.propTypes = {
  value: PropTypes.string.isRequired,
  elementConfig: PropTypes.object,
  label: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  changed: PropTypes.func.isRequired,
  options: PropTypes.array,
};

export default Select;
