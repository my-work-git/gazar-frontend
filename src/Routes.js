import React  from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Main from './pages/main';
import Shop from './pages/shop';
import Basket from './pages/basket';
import OrderedBasket from './pages/ordered_basket';
import SingleProduct from './pages/singleProduct';
import Login from './pages/login';
import Account from './pages/account';
import PaymentCallback from './pages/paymentCallback';
import IdramCallback from './pages/idramCallback';
import Contact from './pages/statics/contact';
import TermsOfUse from './pages/statics/terms-of-use';
import PrivacyPolicy from './pages/statics/privacy-policy';
import OrderingProcess from './pages/statics/ordering-process';
import Logout from './components/logout';
import Registration from './pages/registration';
import VerifyEmail from './pages/partials/verifyEmail';
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/resetPassword';

export const RequireLogin = ({ user, Component, ...rest }) => (
  <React.Fragment>
    {user._id ? <Component {...rest} /> : <Login {...rest}/>}
  </React.Fragment>
);

export const GetRoutes = ({ user }) => [
  {
    exact: false,
    path: "/account",
    component: (props) => <RequireLogin Component={Account} user={user} { ...props } />,
  },
  {
    exact: false,
    path: "/payment/ameria-callback/:paymentId",
    component: PaymentCallback,
  },
  {
    exact: false,
    path: "/payment/idram-success",
    component: IdramCallback,
  },
  {
    exact: false,
    path: "/payment/idram-fail",
    component: IdramCallback,
  },
  {
    exact: true,
    path: "/terms-of-use",
    component: TermsOfUse,
  },
  {
    exact: true,
    path: "/privacy-policy",
    component: PrivacyPolicy,
  },
  {
    exact: true,
    path: "/order-delivery",
    component: OrderingProcess,
  },
  {
    exact: true,
    path: "/contact",
    component: Contact,
  },
  {
    exact: true,
    path: "/login",
    component: Login,
  },
  {
    exact: true,
    path: "/registration",
    component: Registration,
  },
  {
    exact: true,
    path: "/logout",
    component: Logout,
  },
  {
    path: "/shop",
    component: Shop,
  },
  {
    exact: true,
    path: "/basket",
    component: Basket,
  },
  {
    exact: true,
    path: "/basket/:id",
    component: OrderedBasket,
  },
  {
    exact: true,
    path: "/",
    component: Main,
  },
  {
    exact: true,
    path: "/verify-email/:verifyCode",
    component: VerifyEmail,
  },
  {
    exact: true,
    path: "/forgotPassword",
    component: ForgotPassword,
  },
  {
    exact: true,
    path: "/password-reset/:verifyCode",
    component: ResetPassword,
  }
];

export default ({ user, activeLanguage, ...rest }) => (
  <Switch>
    {GetRoutes({ user }).map(({ path, ...rest }) => [
      <Route key={path + activeLanguage} path={`/:lang(en|am|ru)${path}`} {...rest} />,
      <Route key={path} path={path} {...rest} />,
    ])}
    <Redirect to="/page-not-found" />
  </Switch>
);


