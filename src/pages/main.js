import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import Link from '../components/Link';
import { fixCategoriesMenu, addProductToBasket, showGlobalSpinner, hideGlobalSpinner } from '../store/action';
import { isDesktop } from '../helpers';
import Sidebar from '../components/UI/sidebar/index';
import Content from '../components/UI/content/index';
import ImageSlider from '../components/imageSlider/index';
import SideBarCards from '../components/UI/sideBarCards';
import SectionPanel from '../components/UI/sectionPanel';
import ProductItem from '../components/products/productItem';
import Button from '../components/common/button';
import Translate, { tr } from '../translate';
import { PRODUCTS_QUERY } from '../graph-ql';
import { Helmet } from 'react-helmet';

import slider1 from '../images/slider1.jpg';
import slider2 from '../images/slider2.jpg';
import Spinner from '../components/UI/spinner';

@graphql(PRODUCTS_QUERY, { name: 'featuredQuery', options: () => ({
  variables: { featured: true }
  })})
@graphql(PRODUCTS_QUERY, { name: 'productsQuery', options: () => ({
  variables: { category: 'top-products' }
  })})
  class Main extends Component {
    state = {};
  
    constructor(props) {
      super(props);
      this.props.fixCategoriesMenu(isDesktop());
  
      if (window) {
        window.onresize = () => this.props.fixCategoriesMenu(isDesktop());
      }
    }
  
    componentWillUpdate() {
      const { fixCategories } = this.props;
      if (isDesktop() && !fixCategories) {
        this.props.fixCategoriesMenu(false);
      }
    }
  
    componentWillUnmount() {
      if (window) {
        this.props.fixCategoriesMenu(false);
      }
    }
  
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
  
      const { fixCategories , categories, addProductToBasket, basket_products, productsQuery, featuredQuery, activeLanguage } = this.props;
      const sliderImages = [
        {
          original: slider1,
        },
        {
          original: slider2,
        },
      ];
  
      const { products, loading } = productsQuery;
      const { products: featuredProducts } = featuredQuery;
  
      return (
        <div className="container margin_bottom_138">
          <Helmet>
            <title>{tr('TITLE', activeLanguage)}</title>
            <meta name="description" content={tr('TITLE', activeLanguage)} />
          </Helmet>
          <div className="row">
            <Sidebar fixCategories={fixCategories} marginTop={categories.length * 45}>
              <SectionPanel title="FREE_DELIVERY" className='hidden-md-down mt-3 pt-4'>
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
              <section className="banner">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-12">
                      {/*<ImageSlider images={sliderImages} />*/}
                    </div>
                  </div>
                </div>
              </section>
              {
                featuredProducts && featuredProducts.length > 0 && (
                  <section className="featured-products-section">
                    <p>&nbsp;</p>
                    <SectionPanel title="FEATURED_PRODUCTS">
                      <div className="row" style={{  }}>
                        {featuredProducts.slice().sort(this.compare).map((product, index) => {
                          const f = basket_products.filter(p => p._id === product._id);
                          return (
                            <div key={index} className="col-md-3 col-sm-6 col-6 product-item-wrap">
                              <ProductItem product={product} addToBasket={addProductToBasket} inBasket={f && f.length > 0} />
                            </div>
                          );
                        })}
                      </div>
                    </SectionPanel>
                  </section>
                )
              }
              <p>&nbsp;</p>
              <section>
                <SectionPanel title="TOP_SELLING_PRODUCTS">
                  <div className="row">
                    {products && products.slice().sort(this.compare).map((product, index) => {
                      const f = basket_products.filter(p => p._id === product._id);
                      return (
                        <div key={index} className="col-md-3 col-sm-6 col-6 product-item-wrap">
                          <ProductItem product={product} addToBasket={addProductToBasket} inBasket={f && f.length > 0} />
                        </div>
                      );
                    })}
                  </div>
                  <div>&nbsp;</div>
                  <p className="text-center">
                    <Link to="/shop">
                      <Button className="btn-color">
                        <Translate W="SHOW_MORE" />
                      </Button>
                    </Link>
                  </p>
                </SectionPanel>
              </section>
            </Content>
          </div>
  
          {loading && <Spinner />}
        </div>
      );
    }
  }

const mapProps = state => ({
  categories: state.initial.categories,
  fixCategories: state.initial.fixCategories,
  basket_products: state.basket.products,
  activeLanguage: state.initial.activeLanguage,
});

const mapDispatch = dispatch => ({
  fixCategoriesMenu: shouldFix => dispatch(fixCategoriesMenu(shouldFix)),
  addProductToBasket: product => dispatch(addProductToBasket(product)),
});

export default connect(
  mapProps,
  mapDispatch,
)(Main);
