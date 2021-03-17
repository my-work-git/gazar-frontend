import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ disabled, className, children, onClick, ...rest }) => (
  <button disabled={disabled} className={className} onClick={onClick} {...rest}>
    {children}
  </button>
);

Button.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default Button;
