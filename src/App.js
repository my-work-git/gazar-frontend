import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Route } from 'react-router-dom';
import { setCategories, showGlobalSpinner, hideGlobalSpinner, setUserInfo, refetchUser } from './store/action';
import Header from './components/header';
import Footer from './components/footer';
import Spinner from './components/UI/spinner';
import BasketFooter from './components/basketFooter';
import AppDownloadFooter from './components/appDownloadFooter';
import ScrollToTop from './components/ScrollToTop';
import AccountInfoModal from './components/accountInfoModal';
import { CATEGORIES_QUERY, FULL_ME } from './graph-ql';
import Routes from './Routes';
import { LanguageProvider } from './translate';

@graphql(CATEGORIES_QUERY, { name: 'categoriesQuery' })
@graphql(FULL_ME, { name: 'userQuery' })
class App extends Component {
  state = {
    userInfoModalOpen: true,
  };

  constructor(props) {
    super(props);
    const { showGlobalSpinner } = this.props;
    showGlobalSpinner();
  }

  async componentDidMount() {
    const { refetchUser, userQuery } = this.props;
    await userQuery.refetch();
    refetchUser(false);
    this.testAndSetUserInfo();
  }

  async componentWillReceiveProps(nextProps) {
    const { categoriesQuery, userQuery, shouldFetchUser } = nextProps;
    const { refetchUser, user } = this.props;
    const { categories } = categoriesQuery;
    if (this.props.categories.length === 0 && categories && categories.length > 0) {
      this.props.setCategories(categories);
    }

    if (shouldFetchUser) {
      await userQuery.refetch();
      refetchUser(false);
      this.testAndSetUserInfo();
    } else if (!user._id) {
      this.testAndSetUserInfo();
    }
  }

  testAndSetUserInfo() {
    const { me, loading } = this.props.userQuery;
    if (!loading) {
      this.props.setUserInfo(me);
    }
  }

  render() {
    const { userInfoModalOpen } = this.state;
    const { categories, fixCategories, activeLanguage, basket_products, categoriesQuery, user, refetchUser } = this.props;
    const { loading } = categoriesQuery;
    const footerMenuItems = [
      { name: 'LOGIN', to: '/login' },
      { name: 'MY_ACCOUNT', to: '/account' },
      { name: 'MY_ORDERS', to: '/account/orders' },
      { name: 'CONTACT_US', to: '/contact' },
    ];
    const footerSecondary = [
      { name: 'TERMS_OF_USE', to: '/terms-of-use' },
      { name: 'PRIVACY_POLICY', to: '/privacy-policy' },
      { name: 'ORDER_AND_DELIVERY', to: '/order-delivery' },
    ];

    return (
      <LanguageProvider {...this.props}>
        <ScrollToTop>
          <Header
            fixCategories={fixCategories}
            categories={categories}
            basket_products={basket_products}
          />
          <Routes {...this.props} />
          <BasketFooter basket_products={basket_products} />
          <AppDownloadFooter />
          <Footer menuItems={footerMenuItems} secondaryItems={footerSecondary} />
          {loading && <Spinner />}
          <AccountInfoModal user={user} refetchUser={refetchUser} />
        </ScrollToTop>
      </LanguageProvider>
    );
  }
}

const mapProps = state => ({
  user: state.initial.user,
  activeLanguage: state.initial.activeLanguage,
  shouldFetchUser: state.initial.shouldFetchUser,
  fixCategories: state.initial.fixCategories,
  categories: state.initial.categories,
  globalSpinner: state.initial.globalSpinner,
  basket_products: state.basket.products,
});

const mapDispatch = dispatch => ({
  setCategories: categories => dispatch(setCategories(categories)),
  showGlobalSpinner: () => dispatch(showGlobalSpinner()),
  hideGlobalSpinner: () => dispatch(hideGlobalSpinner()),
  setUserInfo: (user) => dispatch(setUserInfo(user)),
  refetchUser: (user) => dispatch(refetchUser(user)),
});

export default connect(
  mapProps,
  mapDispatch,
)(App);
