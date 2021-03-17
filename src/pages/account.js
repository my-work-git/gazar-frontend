import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Sidebar from '../components/UI/sidebar';
import Content from '../components/UI/content';
import SidebarLinkHolder from '../components/sidebarLinkHolder';
import { Helmet } from 'react-helmet';

import AccountInfo from './partials/accountInfo';
import AccountOrders from './partials/accountOrders';
import AccountAddress from './partials/accountAddress';
import { tr } from '../translate';
import { connect } from 'react-redux';

const menuItems = [
  { to: '/account', text: 'ACCOUNT_INFORMATION' },
  { to: '/account/addresses', text: 'MY_ADDRESSES' },
  { to: '/account/orders', text: 'MY_ORDERS' },
];
const mapStateToProps = state => ({
  activeLanguage: state.initial.activeLanguage,
});

class Page extends Component {
  render() {
    const { location, activeLanguage } = this.props;
    return (
      <div className="container margin_bottom_138">
        <Helmet>
          <title>{`${tr('ACCOUNT_INFORMATION', activeLanguage)} - ${tr('TITLE', activeLanguage)}`}</title>
          <meta name="description" content={`${tr('ACCOUNT_INFORMATION', activeLanguage)} - ${tr('TITLE', activeLanguage)}`} />
        </Helmet>
        <div className="row">
          <Sidebar>
            <SidebarLinkHolder title="PROFILE" items={menuItems} location={location} />
          </Sidebar>
          <Content>
            <section>
              <Switch>
                <Route exact path="/(en|am|ru)/account/addresses" component={AccountAddress} />
                <Route exact path="/account/addresses" component={AccountAddress} />
                <Route exact path="/(en|am|ru)/account/orders" component={AccountOrders} />
                <Route exact path="/account/orders" component={AccountOrders} />
                <Route exact path="/(en|am|ru)/account" component={AccountInfo} />
                <Route exact path="/account" component={AccountInfo} />
              </Switch>
            </section>
          </Content>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Page);
