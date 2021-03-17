import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Sidebar from '../components/UI/sidebar';
import SectionPanel from '../components/UI/sectionPanel';
import SideBarCards from '../components/UI/sideBarCards';
import Content from '../components/UI/content';
import ProductItem from '../components/products/productItem';
import { PRODUCT_QUERY, PRODUCTS_ORDERED_WITH_QUERY } from '../graph-ql';
import { addProductToBasket } from '../store/action';
import Translate, {tr, trObject} from '../translate';
import { Helmet } from 'react-helmet';

@graphql(PRODUCTS_ORDERED_WITH_QUERY, { name: 'productsWithQuery', options: ({ match: {params} }) => ({
    variables: { product_id: params.id }, fetchPolicy: 'network-only',
  })})
@graphql(PRODUCT_QUERY, { name: 'productQuery', options: ({ match: {params} }) => ({
    variables: { product_id: params.id }, fetchPolicy: 'network-only',
  })})
class singleProduct extends Component {
  state = {};

  render() {
    const { productQuery, productsWithQuery, addProductToBasket, basket_products, activeLanguage } = this.props;
    const { product, loading: productLoading } = productQuery;
    const { productsOrderedWith, loading: orderedWithLoading } = productsWithQuery;
    const productInBasket = !!(product && basket_products.find(p => p._id === product._id));
    const hasDescription = product && product.descriptionAm && product.descriptionEn && product.descriptionRu;

    return (
      <div className="container margin_bottom_138">
        <Helmet>
          <title>
            {`${trObject(product, 'name', activeLanguage)} ${tr('TITLE', activeLanguage)}`}
          </title>
          <meta name="description" content={tr('PRODUCT_DESCRIPTION', activeLanguage)} />
        </Helmet>
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
              <SectionPanel title={<Translate object={product} keyPrefix="name" />}>
                <div className="text-center">
                  {productLoading && !product ? <i className='fa fa-spinner fa-spin' style={{ fontSize: 25 }} /> : (
                    <div className='row'>
                      <div className={`col-md-4 offset-md-${hasDescription ? '2' : '4'} col-sm-8 offset-sm-2 col-xs-12`}>
                        <ProductItem
                          product={product}
                          addToBasket={addProductToBasket}
                          inBasket={productInBasket}
                          noBorder
                        />
                      </div>
                      <p>&nbsp;</p>
                      {hasDescription && (
                        <div className='col-md-4 col-sm-8 col-xs-12'>
                          <ReactMarkdown source={product[`description${activeLanguage[0].toUpperCase()}${activeLanguage[1]}`]} escapeHtml />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </SectionPanel>
              <p>&nbsp;</p>
              <SectionPanel title="OFTEN_ORDERED_WITH">
                { orderedWithLoading && <p className="text-center"><i className='fa fa-spinner fa-spin' style={{ fontSize: 25 }} /></p> }
                <div className="row">
                  {!orderedWithLoading && productsOrderedWith && productsOrderedWith.map(product => {
                    const f = basket_products.filter(p => p._id === product._id);
                    return (
                      <div key={product._id} className="col-md-3 col-sm-6 col-6 product-item-wrap">
                        <ProductItem
                          key={product._id}
                          product={product}
                          addToBasket={addProductToBasket}
                          inBasket={f && f.length > 0}
                        />
                      </div>
                    );
                  })}
                </div>
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
  activeLanguage: state.initial.activeLanguage,
});

const mapDispatch = dispatch => ({
  addProductToBasket: product => dispatch(addProductToBasket(product)),
});

export default connect(
  mapProps,
  mapDispatch
)(singleProduct);
