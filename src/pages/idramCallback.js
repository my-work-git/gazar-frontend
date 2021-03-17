import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import { graphql } from 'react-apollo';
import Translate, { tr } from '../translate';
import SegmentBlock from '../components/segmentBlock';
import SectionPanel from '../components/UI/sectionPanel';
import { SEND_IDRAM_REPORT } from '../graph-ql';
import { clearBasket} from '../store/action';
import {connect} from "react-redux";
import queryString from '../helpers/query-string';

let path;

class idramCallback extends Component {
  componentDidMount() {
    path = this.props.location.pathname;
    if (this.props.location.search) {
      const q = queryString.parse(this.props.location.search);
    }
    if(this.props.location.pathname === '/payment/idram-success'){
      this.props.clearBasket()
    }
  }

  render() {
    let x;
    if( path === '/payment/idram-fail'){
      x = <div className="fail_page">
        <h1><Translate W="FAILED_PAYMENT" /></h1>
      </div>;
    }
    else {
       x = <Redirect to="/account/orders" />
    }

    return x;


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
)(idramCallback);