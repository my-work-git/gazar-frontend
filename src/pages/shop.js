import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Router, Redirect, Route, Switch, Link } from 'react-router-dom';
import Sidebar from '../components/UI/sidebar/index';
import Content from '../components/UI/content/index';
import SideBarCards from '../components/UI/sideBarCards';
import SectionPanel from '../components/UI/sectionPanel';
import ProductItem from '../components/products/productItem';
import CategoriesFilter from '../components/categoriesFilter';
import { addProductToBasket, hideGlobalSpinner, showGlobalSpinner } from '../store/action';
import { PRODUCTS_QUERY } from '../graph-ql';
import { getUrlCategories, getKeyQuery } from '../helpers';
import { tr } from '../translate';
import { Helmet } from 'react-helmet';
import ProductModal from '../components/products/productModal';

@graphql(PRODUCTS_QUERY, { name: 'productsQuery', options: ({ location: { search } }) => ({
    variables: { category: getUrlCategories(search).join(','), query: getKeyQuery(search) }
  })})
class Page extends Component {
  compare( a, b) {
    let lang = localStorage.getItem('lang');
    if(lang){
      if( a[`name${JSON.parse(lang)[0].toUpperCase()}${JSON.parse(lang)[1]}`] < b[`name${JSON.parse(lang)[0].toUpperCase()}${JSON.parse(lang)[1]}`]){
        return -1;
      }
      if( a[`name${JSON.parse(lang)[0].toUpperCase()}${JSON.parse(lang)[1]}`] > b[`name${JSON.parse(lang)[0].toUpperCase()}${JSON.parse(lang)[1]}`]){
        return 1;
      }
    } else {
      localStorage.setItem('lang', JSON.stringify('am'));
      lang = localStorage.getItem('lang');
      if( a[`name${JSON.parse(lang)[0].toUpperCase()}${JSON.parse(lang)[1]}`] < b[`name${JSON.parse(lang)[0].toUpperCase()}${JSON.parse(lang)[1]}`]){
        return -1;
      }
      if( a[`name${JSON.parse(lang)[0].toUpperCase()}${JSON.parse(lang)[1]}`] > b[`name${JSON.parse(lang)[0].toUpperCase()}${JSON.parse(lang)[1]}`]){
        return 1;
      }
    }
    return 0;
  }
  render() {
    const { categories, basket_products, addProductToBasket, productsQuery, activeLanguage } = this.props;
    const { products, loading } = productsQuery;
    return (
      <div className="container margin_bottom_138">
        <Helmet>
          <title>{`${tr('SHOP', activeLanguage)} ${tr('TITLE', activeLanguage)}`}</title>
          <meta name="description" content={`${tr('SHOP', activeLanguage)} - ${tr('TITLE', activeLanguage)}`} />
        </Helmet>
        <div className="row">
          <Sidebar>
            <CategoriesFilter categories={categories} />
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
              <SectionPanel title="SHOP_PRODUCTS">
              {loading && <p className="text-center"><i className='fa fa-spinner fa-spin' style={{ fontSize: 25 }} /></p>}
                <div className="row">

                  {products && products.filter(product => product)
                    .sort((a, b) => a.category._id > b.category._id ? 1 : -1).map((product, index) => {
                      const f = basket_products.filter(p => p._id === product ._id);
                      return (
                        <div key={product._id} className="col-md-3 col-sm-6 col-6 product-item-wrap">
                          <ProductItem
                            key={product._id}
                            product={product}
                            addToBasket={addProductToBasket}
                            inBasket  ={f && f.length > 0}
                          />
                        </div>
                      );
                    })}
                </div>
              </SectionPanel>
            </section>
          </Content>
        </div>
        <Route
          key={1}
          // exact={true}
          path={window.location.pathname.match(`(am|ru|en)`) !== null ? `/:lang/shop/product/:productId` : `/shop/product/:productId`}
          render={props => <ProductModal
            { ...props }
            open={!!props.match.params.productId}
            products={products}
            addToBasket={addProductToBasket}
            basketProducts={basket_products}
          />}
        />
      </div>
    );
  }
}

const mapProps = state => ({
  activeLanguage: state.initial.activeLanguage,
  categories: state.initial.categories,
  basket_products: state.basket.products,
});

const mapDispatch = dispatch => ({
  addProductToBasket: product => dispatch(addProductToBasket(product)),
  showGlobalSpinner: () => dispatch(showGlobalSpinner()),
  hideGlobalSpinner: () => dispatch(hideGlobalSpinner()),
});

export default connect(
  mapProps,
  mapDispatch,
)(Page);
