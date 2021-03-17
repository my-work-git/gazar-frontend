import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Sidebar from '../components/UI/sidebar';
import SectionPanel from '../components/UI/sectionPanel';
import SideBarCards from '../components/UI/sideBarCards';
import Content from '../components/UI/content';
import ProductItem from '../components/products/productItem';
import { BASKET_PRODUCTS_QUERY } from '../graph-ql';
import { addProductToBasket } from '../store/action';
import Button from '../components/common/button';
import Translate from '../translate';

@graphql(BASKET_PRODUCTS_QUERY, { name: 'productsQuery', options: ({ match: { params } }) => ({
    variables: { basket_id: params.id }
  })})
class Page extends Component {
  state = {};

  orderBasketProducts = () => {
    const { productsQuery, addProductToBasket, history } = this.props;
    const { basketProducts: products } = productsQuery;
    if (products && products.length > 0) {
      products.map(p => addProductToBasket(p));
    }

    history.push('/basket');
  };

  render() {
    const { productsQuery, basket_products, addProductToBasket } = this.props;
    const { basketProducts: products, loading } = productsQuery;

    return (
      <div className="container margin_bottom_138">
        <div className="row">
          <Sidebar>
            <SectionPanel title="FREE_DELIVERY" className='hidden-md-down'>
              <SideBarCards
                items={[
                  { title: '10-11am', description: '10-11am-DESCRIPTION' },
                  { title: '13-14pm', description: '13-14pm-DESCRIPTION' },
                  { title: '16-17pm', description: '16-17pm-DESCRIPTION' },
                  { title: '19-20pm', description: '19-20pm-DESCRIPTION' },
                ]}
              />
            </SectionPanel>
          </Sidebar>
          <Content>
            <section>
              <SectionPanel title="BASKET">
                <p className="text-center">
                  {loading ? <i className='fa fa-spinner fa-spin' style={{ fontSize: 25 }} /> : (
                    <Button className="btn-color" onClick={this.orderBasketProducts}>
                      <Translate W="ORDER_THIS_BASKET" />
                    </Button>
                  )}
                </p>
                <div className="row">
                  {products && products.map((product, index) => {
                    const f = basket_products.filter(p => p._id === product._id);
                    return (
                      <div key={index} className="col-md-3 col-sm-6 col-6 product-item-wrap">
                        <ProductItem
                          product={product}
                          addToBasket={addProductToBasket}
                          inBasket={f && f.length > 0}
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-center">
                  {!loading && (
                    <Button className="btn-color" onClick={this.orderBasketProducts}>
                      <Translate W="ORDER_THIS_BASKET" />
                    </Button>
                  )}
                </p>
              </SectionPanel>
            </section>
          </Content>
        </div>
      </div>
    );
  }
}


const mapProps = state => ({
  basket_products: state.basket.products,
});

const mapDispatch = dispatch => ({
  addProductToBasket: product => dispatch(addProductToBasket(product)),
});

export default connect(
  mapProps,
  mapDispatch,
)(Page);
