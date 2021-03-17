import React, { Component } from 'react';
import { Link, NavLink as RNavLink, withRouter }  from 'react-router-dom';

@withRouter
class CustomLink extends Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.props.activeLanguage !== nextProps.activeLanguage;
  // }

  render() {
    const { to, navLink, withoutLang, staticContext, match: { params: {lang} }, ...rest } = this.props;
    const path = withoutLang || !lang ? to : `/${lang}${to}`;
    return navLink ? <RNavLink to={path} {...rest} /> : <Link to={path} {...rest} />;
  }
}

export const NavLink = (props) => <CustomLink {...props} navLink />;
export default CustomLink;
