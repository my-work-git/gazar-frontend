import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from '../Link';
import Translate from '../../translate/';
import GazarLogo from '../../images/gazar-logo.svg';

class MainNavbar extends React.PureComponent {
  state = {
    mobileMenuDisplay: false,
  };

  detectClick = () => {
    this.content.style.display = 'none';
    this.setState({ mobileMenuDisplay: false });
    document.removeEventListener('click', this.detectClick);
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.detectClick);
  }

  menuToggle = () => {
    const newVal = !this.state.mobileMenuDisplay;
    if (newVal) {
      document.addEventListener('click', this.detectClick);
    } else {
      document.removeEventListener('click', this.detectClick);
    }
    this.content.style.display = !newVal ? 'none' : 'block';
    this.setState({ mobileMenuDisplay: newVal });
  };

  render() {
    return (
      <div className="header-middle">
        <div className="container">
          <div className="row m-0">
            <div className="col-xl-2 col-lg-3 col-lgmd-20per p-0" id="logoContainer">
              <div className="header-middle-left">
                <div className="navbar-header float-none-sm">
                  <NavLink className="navbar-brand page-scroll" activeClassName="" to="/" id="navbar-logo-link">
                    <img alt="Gazar.am" src={this.props.logo || GazarLogo} />
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="col-xl-10 col-lg-9 col-12 col-lgmd-80per p-0">
              <div className="bottom-inner right-side float-none-sm">
                <div className="position-r">
                  <div className="nav_sec position-r">
                    <div className="mobilemenu-title mobilemenu" onClick={this.menuToggle}>
                      <span>
                        <Translate W="MENU" />
                      </span>
                      <i className="fa fa-bars pull-right" />
                    </div>
                    <div
                      className="mobilemenu-content"
                      ref={ref => {
                        this.content = ref;
                      }}
                    >
                      <ul className="nav navbar-nav" id="menu-main">
                        {this.props.items &&
                          this.props.items.map(item => (
                            <li key={item.name}>
                              <NavLink to={item.linkTo}>
                                <Translate W={item.name} />
                              </NavLink>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
MainNavbar.propTypes = {
  logo: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
};

export default MainNavbar;
