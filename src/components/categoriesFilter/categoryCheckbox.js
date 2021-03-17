import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from '../common/input';
import Translate from '../../translate/index';

const CategoryCheckbox = ({ slug, name, productCount, checked, onChange }) => {
  const elementConfig = { type: 'checkbox', slug, name: slug, checked, onChange };
  return (
    <li>
      <div className="check-box">
          <span>
            <Input
              id={slug}
              className="checkbox"
              changed={onChange}
              {...elementConfig}
            />
            <label htmlFor={slug}>
              {typeof name === 'string' ? <Translate W={name} /> : name} <span>({productCount})</span>
            </label>
          </span>
      </div>
    </li>
  );
};

CategoryCheckbox.propTypes = {
  name: PropTypes.any.isRequired,
  slug: PropTypes.string.isRequired,
  productCount: PropTypes.number,
  onChange: PropTypes.func,
};

CategoryCheckbox.defaultProps = {
  productCount: 0,
  onChange: () => {},
};

export default CategoryCheckbox;
