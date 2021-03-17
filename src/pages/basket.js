import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from '../components/Link';
import SectionPanel from '../components/UI/sectionPanel';
import ProductItem from '../components/products/productItem';
import {
  removeProductFromBasket,
  updateBasketProductQuantity,
  clearBasket,
} from '../store/action';
import SegmentBlock from '../components/segmentBlock';
import Button from '../components/common/button';
import Input from '../components/common/input';
import Translate, { tr } from '../translate';
import {
  getTotalPrice,
  DELIVERY_TIMES,
  setToken,
  DeliveryTimeIsToday,
  currentDeliveryTime,
  MIN_ORDER_LIMIT,
  deliveryDateHandler,
} from '../helpers';
import moment from 'moment';
import SelectControl from '../components/common/selectControl';
import Modal from '../components/modal';
import Spinner from '../components/UI/spinner';
import { graphql } from 'react-apollo';
import { LOGIN_OR_REGISTER, SET_ORDER } from '../graph-ql';
import debounce from 'lodash.debounce';
import { Helmet } from 'react-helmet';

import visa from '../images/pay1.png';
import mastercard from '../images/pay2.png';
import maestro from '../images/pay3.png';
import visaElectron from '../images/pay4.png';
import arcaLogo from '../images/arca-logo.gif';
import IdramLogo from '../images/Idram.png';
import PhoneNumberInput from '../components/phoneNumberInput';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

@graphql(LOGIN_OR_REGISTER, { name: 'loginMutation' })
@graphql(SET_ORDER, { name: 'setOrder' })
class Page extends Component {
  state = {
    formData: {
      phoneNumber: '',
      address: '',
      notes: '',
      verifyCode: '',
      deliveryTime: currentDeliveryTime(Page.minDateSelect),
      paymentMethod: 'cash',
      deliveryDate: Page.minDateSelect,
    },
    verifyOpen: false,
    requesting: false,
    error: false,
    success: false,
    shopOrderId: '',
    showMinOrderPrice: false,
    generatedDeliveryTimes: []
  };


  static minDateSelect = moment().hours() >= 18
      ? moment().add(1,'days').startOf('day').toDate()
      : moment().toDate();

  componentDidMount() {
    this.checkAndSetUserData(this.props);

    this.setState({
      generatedDeliveryTimes: this.generateDeliveryTimes(Page.minDateSelect, currentDeliveryTime(Page.minDateSelect))
    });
    this.timerID = setInterval(() => {
      this.setState({
        generatedDeliveryTimes: this.generateDeliveryTimes(moment().hours() >= 18 
          ? moment().add(1,'days').startOf('day').toDate()
          : moment().toDate(), currentDeliveryTime(moment().hours() >= 18
          ? moment().add(1,'days').startOf('day').toDate()
          : moment().toDate()))
      });
      this.setState((prevState) => {
          return {
            formData: {
              ...prevState.formData,
              deliveryDate: moment().hours() >= 18
              ? moment().add(1,'days').startOf('day').toDate()
              : moment().toDate(),
              deliveryTime: currentDeliveryTime(moment().hours() >= 18
              ? moment().add(1,'days').startOf('day').toDate()
              : moment().toDate()),
            }
          };
        }
      );
      // console.log(this.state.formData);
      // console.log(this.state.generatedDeliveryTimes);
    },300000);

    const products = this.formatProductsForAnalytics();

    if (products && products.length > 0) {
      try {
        dataLayer.push({
          'event': 'checkout',
          'ecommerce': {
            'checkout': {
              'actionField': { 'step': 1 }, // Review Basket
              'products': products,
            }
          },
        });
      } catch(e) {}
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  componentWillReceiveProps(nextProps) {
    this.checkAndSetUserData(nextProps);
  }

  formatProductsForAnalytics = (service) => {
    const { basket_products } = this.props;

    if (service === 'GA') {
      return basket_products.map(product => ({
        'name': product.nameAm,
        'id': product._id,
        'price': product.price,
        'quantity': product.quantity,
      }));
    }
  };

  checkAndSetUserData = (nextProps) => {
    const { user } = nextProps;
    let { phoneNumber, address, notes } = this.state.formData;
    if (phoneNumber.length === 0 && user.phoneNumber) {
      phoneNumber = user.phoneNumber;
    }

    if (address.length === 0 && user.addresses && user.addresses.length > 0) {
      address = user.addresses[0].address;
      notes = user.addresses[0].notes;
    }

    if (phoneNumber.length > 0 || address.length > 0 || notes.length > 0) {
      this.setState({ formData: { ...this.state.formData, phoneNumber, address, notes }});
    }
  };

  trackCheckoutStep = (step, option) => {
    try {
      dataLayer.push({
        'event': 'checkout',
        'ecommerce': {
          'checkout': {
            'actionField': { step, option },
          },
        },
      });
    } catch(e) {}
  }

  trackCheckoutStepDebounced = debounce(this.trackCheckoutStep, 4000)

  fieldChange = ({ target: { name, value } }) => {
    this.setState({ formData: { ...this.state.formData, [name]: value } });
    if (name == 'phoneNumber') this.trackCheckoutStepDebounced(2)
    if (name == 'address') this.trackCheckoutStepDebounced(3)
    if (name == 'deliveryTime') this.trackCheckoutStep(4, value)
  }

  addressFieldChangeHandler = value => this.setState({
    formData: {
      ...this.state.formData,
      address: value,
    },
  });

  selectAddresses = () => {
    const { user: { addresses } } = this.props;
    if (!addresses) return [];
    return addresses.map(addr => ({
      value: addr.address,
      text: addr.address,
      notes: addr.notes,
    }));
  };

  productQuantityChange = product => quantitiy => {
    const { updateBasketProductQuantity: updateQuantity } = this.props;
    updateQuantity(product._id, quantitiy);
  };

  changeDeliveryTime = deliveryTime => () => {
    this.setState({
      generatedDeliveryTimes: this.generateDeliveryTimes(this.state.formData.deliveryDate, deliveryTime.value)
    });
    this.fieldChange({ target: { name: 'deliveryTime', value: deliveryTime.value }});
  };

  changeAddressSelect = user_address => {
    this.setState({ formData: {
      ...this.state.formData,
      address: user_address.value,
      notes: user_address.notes,
    }})
  };

  setPaymentMethod = method => () => this.setState({ formData: { ...this.state.formData, paymentMethod: method }});

  loginUserBeforeOrder = async () => {
    const { loginMutation, activeLanguage: lang, basket_products } = this.props;
    const totalPrice = getTotalPrice(basket_products);
    if (totalPrice < MIN_ORDER_LIMIT) {
      this.setState({ showMinOrderPrice: true });
      return;
    }

    this.setState({ error: false, requesting: true });
    const { phoneNumber } = this.state.formData;
  
    const res = await loginMutation({ variables: { phoneNumber, lang }});
    const { error, message } = res.data.loginOrRegister;
    if (error) {
      this.setState({ error: message, requesting: false });
      return false;
    } else {
      this.setState({ verifyOpen: true, requesting: false });
    }

    return true;
  };

  verifyAndSubmitOrder = async e => {
    e.preventDefault();
    const { activeLanguage: lang, setOrder, basket_products, clearBasket } = this.props;
    const totalPrice = getTotalPrice(basket_products);
    if (totalPrice < MIN_ORDER_LIMIT) {
      this.setState({ showMinOrderPrice: true });
      return;
    }

    this.setState({ requesting: true, error: false });
    const { verifyCode, phoneNumber, address, notes, deliveryTime, paymentMethod, deliveryDate } = this.state.formData;
    const variables = {
      phoneNumber, lang, address, notes, deliveryTime, verifyCode, paymentMethod, deliveryDate: deliveryDate.toISOString(),
      products: JSON.stringify(basket_products.map(p => ({ _id: p._id, quantity: p.quantity }))),
    };
    console.log(variables)
    const res = await setOrder({ variables });
    const { error, message, token, orderId, paymentId, idramForm, formUrl } = res.data.setOrder;
    if (error) {
      this.setState({ error: message, requesting: false });
      return;
    }

    this.trackPurchase(orderId, totalPrice);

    setToken(token);
    if (paymentMethod !== 'credit_card' && paymentMethod !== 'idram') {
      this.setState({ verifyOpen: false, requesting: false, success: true, shopOrderId: orderId });
      clearBasket();
      this.props.history.replace(`/basket?order=${orderId}`);
    } else if(paymentMethod === 'credit_card'){
      console.log("credit_card");
      window.location = formUrl;
      // window.location = `https://payments.ameriabank.am/forms/frm_paymentstype.aspx?lang=${lang}&paymentid=${paymentId}`;
    }else if(paymentMethod === 'idram'){
      //idram form submit
      let form = document.createElement("form");
      form.method = idramForm.method;
      form.action = idramForm.action;
      form.name = "idram_form";
      let formInputKeys = Object.keys(idramForm.form_inputs);
      for(let i in formInputKeys){
        console.log(idramForm.form_inputs[formInputKeys[i]])
        let element = document.createElement("input");
        element.type="text";
        element.setAttribute('value', idramForm.form_inputs[formInputKeys[i]]);
        element.name = formInputKeys[i];
        form.appendChild(element);
      }
      document.body.append(form)
      console.log(form)
      form.submit();

    }
  };

  trackPurchase = (orderId, totalPrice) => {
    const { basket_products } = this.props;
    try {
      fbq('track', 'Purchase', {currency: "AMD", value: totalPrice});
      dataLayer.push({
        'ecommerce': {
          'purchase': {
            'actionField': {
              'id': orderId,
              'revenue': totalPrice,
            },
            'products': this.formatProductsForAnalytics('GA'),
          }
        }
      });
    } catch(e) {}
  };

  onOrderSubmit = async e => {
    e.preventDefault();
    this.trackCheckoutStep(5);
    const { user } = this.props;
    if (!user._id) {
      await this.loginUserBeforeOrder();
    } else {
      await this.verifyAndSubmitOrder(e);
    }
  };

  onRemoveProduct = id => {
    if (!confirm(tr('SURE_TO_REMOVE_PRODUCT_FROM_BASKET', this.props.activeLanguage))) {
      return;
    }
    this.props.removeProductFromBasket(id);
  };

  handleChange = deliveryDate => {
    this.setState({
      generatedDeliveryTimes: this.generateDeliveryTimes(deliveryDateHandler(deliveryDate), currentDeliveryTime(deliveryDateHandler(deliveryDate)))
    });
    this.setState((prevState) => {
      return {
        formData: {
          ...prevState.formData,
          deliveryDate: deliveryDateHandler(deliveryDate),
          deliveryTime: currentDeliveryTime(deliveryDateHandler(deliveryDate)),
        }
      };
    });
  };

  

  generateDeliveryTimes = (deliveryDate, deliveryTime) => DELIVERY_TIMES.filter(
    (delivery_time) =>  DeliveryTimeIsToday(delivery_time.value, deliveryDate)
  ).map(dt => (
    <ul>
    <li
      key={dt.value}
      className={dt.value === deliveryTime ? 'active' : ''}
    >
      <a
        className="delivery-time-option"
        onClick={this.changeDeliveryTime(dt)}
      >
        <Translate W={dt.value} />
      </a>
    </li>
    </ul>
    
  ));


  render() {
    const {
      basket_products, user, activeLanguage,
      clearBasket: clearForm,
    } = this.props;

    const { formData, requesting, error, verifyOpen, success, showMinOrderPrice, shopOrderId } = this.state;
    const { paymentMethod } = formData;
    const userAddresses = this.selectAddresses();
    const selectedAddress = userAddresses.filter(addr => addr.value === formData.address)[0] || userAddresses[0];

    const totalPrice = getTotalPrice(basket_products);

    return (
      <div className="container margin_bottom_138">
        <Helmet>
          <title>{`${tr('BASKET', activeLanguage)} - ${tr('TITLE', activeLanguage)}`}</title>
          <meta name="description" content={`${tr('BASKET', activeLanguage)} - ${tr('TITLE', activeLanguage)}`} />
        </Helmet>
        <p>&nbsp;</p>
        <div className="row">
          <div className="col-md-5">
            <section>
              <SectionPanel title="ORDER_DETAILS">
                <SegmentBlock title=" ">
                  <p><b><Translate W="PRODUCT_COUNT"/></b></p>
                  <p>{basket_products ? basket_products.length : 0}</p>
                  <hr style={{ margin: '15px 0' }} />
                  <p><b><Translate W="TOTAL_PRICE"/></b></p>
                  <p>{totalPrice} <Translate W="AMD"/></p>
                </SegmentBlock>
              </SectionPanel>
            </section>
            <p>&nbsp;</p>
            <section>
              <form className="main-form full" onSubmit={this.onOrderSubmit}>
                <div className="input-box">
                  <PhoneNumberInput
                    value={formData.phoneNumber}
                    onChange={value => this.fieldChange({ target: { name: 'phoneNumber', value } })}
                    placeholder={tr('PHONE_NUMBER', activeLanguage)}
                  />
                </div>
                <div>&nbsp;</div>
                <div className="input-box">
                  {user.addresses && user.addresses.length > 0 ? (
                    <div>
                      <label><Translate W="SHIPPING_ADDRESS"/></label>
                      <SelectControl
                        className={'option-drop'}
                        selected={selectedAddress}
                        onChange={this.changeAddressSelect}
                        list={userAddresses}
                      />
                    </div>
                  ) : (
                    <Input label="SHIPPING_ADDRESS" name='address' value={formData.address} changed={this.fieldChange} />
                  )}
                  <p>
                    <small>
                      <Link to='/account/addresses'><Translate W='MANAGE_ACCOUNT_ADDRESSES' /></Link>
                    </small>
                  </p>
                </div>
                <div>&nbsp;</div>
                <div className="input-box">
                  <label>
                    <Translate W="ORDER_NOTES" />
                  </label>
                  <textarea name='notes' onChange={this.fieldChange} rows={3} value={formData.notes} />
                </div>
                <div>&nbsp;</div>
                <div className="input-box">
                  <label><Translate W="DELIVERY_DAY"/></label>
                  <div className="delivery-day-input">
                  <DatePicker
                    dateFormat="dd/MM/YYYY"
                    selected={formData.deliveryDate}
                    minDate={Page.minDateSelect}
                    onChange={this.handleChange}
                  />
                  </div>
                </div>
                <div>&nbsp;</div>
                <div className="input-box">
                  <label><Translate W="DELIVERY_TIME"/></label>
                  <ul className="tagcloud" style={{ textAlign: 'center' }}>
                    { this.state.generatedDeliveryTimes }
                  </ul>
                </div>
                <div>&nbsp;</div>
                <div className="input-box">
                  <label><Translate W="PAYMENT_METHOD"/></label>
                  <ul className="tagcloud" style={{ textAlign: 'center' }}>
                    <li className={paymentMethod === 'cash' ? 'active' : ''}>
                      <a className="delivery-time-option" onClick={this.setPaymentMethod('cash')}>
                        <Translate W='CASH_PAYMENT' />
                      </a>
                    </li>
                    <li className={paymentMethod === 'credit_card' ? 'active' : ''} onClick={this.setPaymentMethod('credit_card')}>
                      <a className="delivery-time-option">
                        <Translate W='ONLINE_PAYMENT' />
                      </a>
                    </li>
                    <li className={paymentMethod === 'idram' ? 'active' : ''} onClick={this.setPaymentMethod('idram')}>
                      <a className="delivery-time-option">
                        <Translate W='IDRAM_PAYMENT' />
                      </a>
                    </li>
                  </ul>
                  <ul className="tagcloud payment_icon text-center m-4">
                    <li className="visa">
                      <img src={visa} alt="Visa" />
                    </li>
                    <li className="discover">
                      <img src={mastercard} alt="mastercard" />
                    </li>
                    <li className="paypal">
                      <img src={maestro} alt="maestro" />
                    </li>
                    <li className="vindicia">
                      <img src={visaElectron} alt="visaElectron" />
                    </li>
                    <li className="vindicia">
                      <img src={arcaLogo} alt="ARCA" width={47} />
                    </li>
                    <li className="Idram">
                      <img src={IdramLogo} alt="IdramLogo"  />
                    </li>
                  </ul>
                </div>
                <div>&nbsp;</div>
                {error && (
                  <div>
                    <div className="alert alert-danger">{<Translate W={error} />}</div>
                    <div>&nbsp;</div>
                  </div>
                )}
                {totalPrice < MIN_ORDER_LIMIT && (
                  <div className='alert alert-info'>
                    <Translate W="MIN_ORDER_PRICE"/> {MIN_ORDER_LIMIT} <Translate W='AMD'/>
                  </div>
                )}
                <div className="text-center">
                  <Button className="order-btn btn-color">
                    <Translate W="ORDER" />
                  </Button>
                  <a className="clear-basket-btn" style={{ marginLeft: 30 }} onClick={clearForm}><Translate W="CLEAR_BASKET"/></a>
                </div>
                <div>&nbsp;</div>
              </form>
            </section>
          </div>
          <div className="col-md-7">
            <section>
              <SectionPanel title="BASKET">
                {basket_products &&
                  basket_products.map((product, index) => (
                    <ProductItem
                      key={index}
                      product={product}
                      onRemoveFromBasket={this.onRemoveProduct}
                      onQuantityChange={this.productQuantityChange(product)}
                      basketItem
                    />
                  ))}
              </SectionPanel>
            </section>
          </div>
        </div>

        <Modal open={verifyOpen} title="VERIFICATION_CODE" onClose={() => {}}>
          <form className="main-form full" onSubmit={this.verifyAndSubmitOrder}>
            <p>
              <small>
                <Translate W="TRY_AGAIN_IF_NO_SMS" />
              </small>
            </p>
            <div className="input-box">
              <Input
                name="verifyCode"
                value={formData.verifyCode}
                changed={this.fieldChange}
                placeholder={tr('VERIFICATION_CODE', activeLanguage)}
              />
            </div>
            {error && <div className="alert alert-danger">{<Translate W={error} />}</div>}
            <div className="remember_padding text-center">
              <Button className="btn-color verification-btn">
                <Translate W="VERIFY" />
              </Button>
              <Button
                type="button"
                className="btn-link btn-sm"
                onClick={() =>
                  this.setState({
                    verifyOpen: false,
                    formData: { ...formData, verifyCode: '' },
                  })
                }
              >
                <i className="fa fa-close" /> <Translate W="CANCEL" />
              </Button>
            </div>
          </form>
        </Modal>

        <Modal open={success} title="ORDER_SENT" onClose={() => {}}>
          <div className="alert alert-success">
            <Translate W="ORDER_SUCCESS" />
          </div>
          <div className="remember_padding text-center">
            <Button
              className="btn btn-social btn-facebook btn-sm"
              onClick={() => FB.ui({
                method: 'feed',
                link: `https://gazar.am/basket/${shopOrderId}`,
                caption: tr('SHARE_CAPTION_TEXT', activeLanguage),
              }, function(response){})}
            >
              <i className="fa fa-facebook" /> <Translate W="SHARE_WITH_FRIENDS" />
            </Button>

            <div>&nbsp;</div>
            <Button
              className="btn-link btn-sm return-to-shop-btn"
              onClick={() => {
                window.location = '/shop';
              }}
            >
              <i className="fa fa-close" /> <Translate W="CLOSE" />
            </Button>
          </div>
        </Modal>

        <Modal open={showMinOrderPrice} title="MIN_ORDER_PRICE" onClose={() => {}}>
          <div className="alert alert-info">
            <Translate W="MIN_ORDER_PRICE_INFO" />
          </div>
          <div className="remember_padding text-center">
            <Button
              className="btn-link btn-sm"
              onClick={() => this.setState({ showMinOrderPrice: false })}
            >
              <i className="fa fa-close" /> <Translate W="CLOSE" />
            </Button>
          </div>
        </Modal>

        {requesting && <Spinner />}
      </div>
    );
  }
}

const mapProps = state => ({
  user: state.initial.user,
  activeLanguage: state.initial.activeLanguage,
  basket_products: state.basket.products,
});

const mapDispatch = dispatch => ({
  removeProductFromBasket: id => dispatch(removeProductFromBasket(id)),
  updateBasketProductQuantity: (id, quantity) => dispatch(updateBasketProductQuantity(id, quantity)),
  clearBasket: () => dispatch(clearBasket()),
});

export default connect(
  mapProps,
  mapDispatch,
)(Page);
