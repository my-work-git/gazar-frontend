import React from 'react';
import PropTypes from 'prop-types';
import Translate from '../translate';
import Link from '../components/Link';
import visa from '../images/pay1.png';
import mastercard from '../images/pay2.png';
import maestro from '../images/pay3.png';
import visaElectron from '../images/pay4.png';
import arcaLogo from '../images/arca-logo.gif';
import IdramLogo from '../images/Idram.png';
import GoogleIcon from '../images/google-play-badge.png';
import AppStoreIcon from '../images/app-store-badge.png';

const Footer = ({ menuItems, secondaryItems }) => (
  <div className="footer">
    <div className="container">
      <hr />
      <div className="footer-bottom ">
        <div className="row mtb-30">
          <div className="col-lg-4">
            <div className="footer_social mb-sm-30 center-sm">
              <ul className="social-icon">
                <li>
                  <div className="title">
                    <Translate W={'FOLLOW_US'} />
                  </div>
                </li>
                <li>
                  <a
                    title="Facebook"
                    className="facebook"
                    href="https://web.facebook.com/gazar.am?_rdc=1&_rdr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-facebook" />
                  </a>
                </li>
                <li>
                  <a
                    title="Instagram"
                    className="instagram"
                    href="https://www.instagram.com/gazar.am/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-instagram" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="payment">
              {/*<a href='tel:+37455456454'>*/}
                {/*<h5><i className='fa fa-phone' /> 055 456 454</h5>*/}
              {/*</a>*/}
              <ul className="payment_icon">
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
          </div>
          <div className="col-lg-4">
            <div className="payment">
              <ul className="payment_icon">
                <li className="visa">
                  <a href='https://play.google.com/store/apps/details?id=com.gazar.am.mobile&utm_source=gazar.am' target="_blank"><img style={{ height: 40 }} src={GoogleIcon} alt="Get on Google Play" /></a>
                </li>
                <li className="visa">
                  <a href='https://itunes.apple.com/am/app/gazar-am/id1450797729?utm_source=gazar.am' target="_blank"><img style={{ height: 40 }} src={AppStoreIcon} alt="Download on AppStore" /></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="copy-right-bg">
      <div className="container">
        <div className="row  align-center">
          <div className="col-12 mb-30">
            <div className="site-link">
              <ul>
                {menuItems &&
                  menuItems.map((item, i) => (
                    <li key={item.name}>
                      <Link to={item.to}>
                        <Translate W={item.name} />
                      </Link>
                      {i + 1 < menuItems.length && '|'}
                    </li>
                  ))}
              </ul>
            </div>
            <div>&nbsp;</div>
            <div className="site-link">
              <ul>
                {secondaryItems &&
                  secondaryItems.map((item, i) => (
                    <li key={item.name}>
                      <Link to={item.to}>
                        <Translate W={item.name} />
                      </Link>
                      {i + 1 < secondaryItems.length && '|'}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="col-12">
            <div className="">
              <div className="copy-right ">
                © {new Date().getFullYear()} <Translate W={'RIGHTS_RESERVED'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Footer.propTypes = {
  menuItems: PropTypes.array.isRequired,
};

export default Footer;
