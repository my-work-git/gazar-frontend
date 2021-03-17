import React from 'react';
import PropTypes from 'prop-types';
import Translate from '../../translate/index';

const SegmentBlock = ({ children, title }) => (
  <div className="cart-total-table address-box commun-table">
    <div className="table-responsive">
      <table className={title ? 'table' : ''}>
        {title && (
          <thead>
            <tr>
              <th>
                <Translate W={title} />
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          <tr>
            <td>{children}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

SegmentBlock.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default SegmentBlock;
