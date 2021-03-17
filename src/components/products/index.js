import React from 'react';
import PropTypes from 'prop-types';
import Translate from '../../translate';
import ProductItem from './productItem';
import ProductsOrder from './productsOrder';

const Products = ({ products, singleRow }) => {
  if (singleRow) {
    return (
      <div className="cart-item-table commun-table">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <Translate W={'PRODUCT'} />
                </th>
                <th>
                  <Translate W={'PRODUCT_TYPE'} />
                </th>
                <th>
                  <Translate W={'PRICE'} />
                </th>
                <th>
                  <Translate W={'QUANTITY'} />
                </th>
                <th>
                  <Translate W={'TOTAL_PRICE'} />
                </th>
                <th>
                  <Translate W={'CANCEL'} />
                </th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map(product => (
                  <ProductItem key={product._id} product={product} singleRow />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <React.Fragment>
      {products && products.map(product => <ProductItem key={product._id} product={product} />)}
    </React.Fragment>
  );
};

Products.propTypes = {
  products: PropTypes.array,
  singleRow: PropTypes.bool,
};

export default Products;
export { ProductsOrder };
