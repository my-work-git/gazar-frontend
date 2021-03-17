import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { NavLink } from '../Link';
import * as actions from '../../store/action/actionCreator';
import Translate from '../../translate/index';
import SelectControl from '../common/selectControl';

class HeaderTop extends Component {
  changeLanguage = language => {
    const newLang = language.value;
    this.props.onChangeLanguage(newLang);
  };

  render() {
    const { activeLanguage, user, location: { pathname } } = this.props;
    let languages = [
      { value: 'en', text: 'English', icon: '🇬🇧' },
      { value: 'ru', text: 'Русский', icon: '🇷🇺' },
      { value: 'am', text: 'Հայերեն', icon: '🇦🇲' },
    ];
    let cleanPathname = pathname;
    languages.map(lang => cleanPathname = cleanPathname.replace(`/${lang.value}`, ''));

    // Setting current URL per language
    languages = languages.map(lang => ({
      ...lang,
      text: <NavLink to={`/${lang.value}${cleanPathname}`} withoutLang>{lang.text}</NavLink>
    }));

    return (
      <div className="header-top">
        <div className="container">
          <div className="top-line">
            <div className="row">
              <div className="col-sm-5 col-6">
                <div className="language-currency select-dropdown">
                  <fieldset>
                    <SelectControl
                      selected={languages.find(({ value }) => value === activeLanguage)}
                      list={languages}
                      className={'tt-control-holder'}
                    />
                  </fieldset>
                </div>
              </div>
              <div className="col-sm-7 col-6">
                <div className="top-right-link right-side">
                  <ul>
                    {!user._id && [
                      <li key={1} className="login-icon">
                        <NavLink to="/login" title="Login" id="header-login-link">
                          <span>
                            <i className="fa fa-lock" />
                          </span>
                          <Translate W={'LOGIN'} />
                        </NavLink>
                      </li>,
                      <li key={2} className="login-icon">
                        <NavLink to="/registration" title="Login" id="header-login-link">
                          <span>
                            <i className="fa fa-user-plus" />
                          </span>
                          <Translate W={'REGISTRATION'} />
                        </NavLink>
                      </li>
                    ]}
                    <li className="account-icon">
                      <NavLink to="/account" title="My Account" id="header-account-link">
                        <span>
                          <i className="fa fa-user" />
                        </span>
                        <Translate W={'MY_ACCOUNT'} />
                      </NavLink>
                    </li>
                    <li className="wishlist-icon">
                      <NavLink to="/account/orders" title="MY_ORDERS" id="header-orders-link">
                        <span>
                          <i className="fa fa-heart" />
                        </span>
                        <Translate W={'MY_ORDERS'} />
                      </NavLink>
                    </li>
                    {user._id && (
                      <li className="login-icon">
                        <NavLink to="/logout" title="Logout" id="header-logout-link">
                          <span>
                            <i className="fa fa-sign-out" />
                          </span>
                          <Translate W={'LOGOUT'} />
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  activeLanguage: state.initial.activeLanguage,
  user: state.initial.user,
});

const mapDispatchToProps = dispatch => ({
  onChangeLanguage: lang => dispatch(actions.changeLanguage(lang)),
});

HeaderTop.propTypes = {
  activeLanguage: PropTypes.string.isRequired,
  onChangeLanguage: PropTypes.func.isRequired,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderTop));
