import React, { Component } from 'react';
import moment from 'moment';
import { graphql } from 'react-apollo';
import Translate, { tr } from '../translate';
import SegmentBlock from '../components/segmentBlock';
import SectionPanel from '../components/UI/sectionPanel';
import { GET_PAYMENT_INFO } from '../graph-ql';
import { clearBasket, removeProductFromBasket, updateBasketProductQuantity } from '../store/action';
import { connect } from 'react-redux';

@graphql(GET_PAYMENT_INFO, { name: 'paymentQuery', options: ({match: {params: { paymentId }}}) => ({
    variables: {paymentId}
  })})
class paymentCallback extends Component {
  state = {};

  componentWillReceiveProps(nextProps, nextContext) {
    const { paymentQuery: { paymentInfo }, clearBasket, basket_products } = nextProps;
    if (paymentInfo && paymentInfo.state === 'payment_deposited' && basket_products.length > 0) {
      clearBasket();
    }
  }

  getStateText = paymentState => {
    switch (paymentState) {
      case 'payment_declined':
        return 'PAYMENT_DECLINED';
      case 'payment_deposited':
        return 'PAYMENT_SUCCESS';
      default:
        return '';
    }
  };

  render() {
    const { paymentQuery: { paymentInfo, loading } } = this.props;
    return (
      <div className="container margin_bottom_138">
        <p>&nbsp;</p>
        { loading && <p className="text-center"><i className='fa fa-spinner fa-spin' style={{ fontSize: 25 }} /></p> }
        { paymentInfo && (
          <div className="row">
            <div className="col-md-5">
              <SectionPanel title="ORDER_DETAILS">
                <SegmentBlock title=" ">
                  <p><b><Translate W="PRODUCT_COUNT"/></b></p>
                  <p>{paymentInfo.shopOrder.products.length}</p>
                  <hr style={{ margin: '15px 0' }} />
                  <p><b><Translate W="TOTAL_PRICE"/></b></p>
                  <p>{paymentInfo.shopOrder.price} <Translate W="AMD"/></p>
                  <hr style={{ margin: '15px 0' }} />
                  <p><b><Translate W="DELIVERY_TIME"/></b></p>
                  <p><Translate W={paymentInfo.shopOrder.deliveryTime} /></p>
                  <hr style={{ margin: '15px 0' }} />
                  <p><b><Translate W="SHIPPING_ADDRESS"/></b></p>
                  <p><Translate W={paymentInfo.shopOrder.address} /></p>
                  <hr style={{ margin: '15px 0' }} />
                  <p><b><Translate W="PHONE_NUMBER"/></b></p>
                  <p><Translate W={paymentInfo.shopOrder.phoneNumber} /></p>
                </SegmentBlock>
              </SectionPanel>
            </div>
            <div className="col-md-7">
              <SectionPanel title="ORDER_DETAILS">
                <SegmentBlock title=" ">
                  <p><b><Translate W="ORDER_DATE"/></b></p>
                  <p>{moment(paymentInfo.created_at).format('DD/MM/YYYY HH:mm')}</p>
                  <hr style={{ margin: '15px 0' }} />
                  <p><b><Translate W="PAYMENT_CODE"/></b></p>
                  <p># {paymentInfo._id}</p>
                  <hr style={{ margin: '15px 0' }} />
                  <p><b><Translate W="PAYMENT_AMOUNT"/></b></p>
                  <p>{paymentInfo.amount} <Translate W="AMD"/></p>
                  <hr style={{ margin: '15px 0' }} />
                  <p><b><Translate W="PAYMENT_STATUS"/></b></p>
                  <p><Translate W={this.getStateText(paymentInfo.state)} /></p>
                </SegmentBlock>
              </SectionPanel>
            </div>
          </div>
        ) }
      </div>
    );
  }
}

const mapProps = state => ({
  basket_products: state.basket.products,
});

const mapDispatch = dispatch => ({
  clearBasket: () => dispatch(clearBasket()),
});

export default connect(
  mapProps,
  mapDispatch
)(paymentCallback);
