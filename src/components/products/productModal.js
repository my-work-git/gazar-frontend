import React, { Component } from 'react';
import ProductItem from './productItem';
import Modal from '../modal';
import { withRouter } from 'react-router-dom';
import Translate from '../../translate';
import SectionPanel from '../UI/sectionPanel';
import { graphql } from 'react-apollo';
import { PRODUCTS_ORDERED_WITH_QUERY } from '../../graph-ql';
import ImageSlider from "../imageSlider";

@graphql(PRODUCTS_ORDERED_WITH_QUERY, { name: 'productsWithQuery', options: ({ match: {params} }) => ({
    variables: { product_id: params.productId }, fetchPolicy: 'network-only',
  })})
class ProductModal extends Component {
  settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  state = {
    inBasket: false,
    product: null,
    productsOrderedWith: null,
  };

  componentDidMount() {
    /**
     * This part is working when we click on product item to open modal,
     * where we show product depended on match params,
     * and check if that product contains in basket
     */
    if (this.props.products && this.props.match.params.productId && this.props.basketProducts) {
      const product = this.props.products.find((item) => item._id === this.props.match.params.productId);
      this.setState({
        product,
        inBasket: !!this.props.basketProducts.find(item => item._id === product._id),
      });
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    /**
     * This part works when refreshing the page, or opening with concrete url of product
     */
    if (this.props.products && !prevProps.products && this.props.match.params.productId && !this.state.product) {
      const product = this.props.products.find((item) => item._id === this.props.match.params.productId);
      this.setState({
        product,
        inBasket: !!this.props.basketProducts.find(item => item._id === product._id),
      });
    }
    /**
     * This part works , when params changes, it means we click on another product in modal
     */
    if (this.props.match.params.productId !== prevProps.match.params.productId) {
      const product = this.props.products.find((item) => item._id === this.props.match.params.productId);
      this.setState({
        product,
        inBasket: !!this.props.basketProducts.find(item => item._id === product._id),
        productsOrderedWith: this.props.productsWithQuery.productsOrderedWith.slice(0,7),
      });
    }

    /**
     * This part works, when first time opening modal, and sets productsOrderedWith data
     */
    if (this.props.productsWithQuery.productsOrderedWith && !prevProps.productsWithQuery.productsOrderedWith) {
      this.setState({
        productsOrderedWith: this.props.productsWithQuery.productsOrderedWith.slice(0,7),
      })
    }
    return null;
  }

  addToBasket = product => {
    /**
     * As after clicking on basket, we need to set in Basket true, so not to write whole
     * functional of that piece in getSnapshot method, we manually
     * set inBasket true, than send it to parent component to refresh store
     */
    this.setState({
      inBasket: true,
    });
    this.props.addToBasket(product);
  };

  closeHandler = () => this.props.history.push('/shop');

  render() {
    const { productsWithQuery } = this.props;
    const { loading: orderedWithLoading } = productsWithQuery;
    return (
      <Modal
        open={this.props.open}
        onClose={this.closeHandler}
        title={<Translate object={this.state.product} keyPrefix="name" />}
      >
        {
          this.state.product && (
            <div className="col-md-12">
                <ProductItem
                  key={this.state.product._id}
                  product={this.state.product}
                  addToBasket={this.addToBasket}
                  inBasket={this.state.inBasket}
                />
            </div>
          )
        }
        { orderedWithLoading && <p className="text-center">
            <i className='fa fa-spinner fa-spin' style={{ fontSize: 25 }} />
          </p>
        }
        <SectionPanel title="OFTEN_ORDERED_WITH">
          {
            !orderedWithLoading && this.state.productsOrderedWith && (
              <ImageSlider
                products={this.state.productsOrderedWith}
                settings={this.settings}
              />
            )
          }
        </SectionPanel>
      </Modal>
    );
  }
}

export default withRouter(ProductModal);
