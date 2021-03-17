import React, { Component }  from 'react';
import Translate from '../translate';
import GooglePlayIcon from '../images/google-play-badge.png';
import AppStoreIcon from '../images/app-store-badge.png';

class AppDownloadFooter extends Component {
  state = {
    opened: true,
  };

  handleClose = () => this.setState({ opened: false });

  render() {
    if (this.state.opened && navigator && navigator.userAgent) {
      const nua = navigator.userAgent;
      const is_android = /Android/.test(nua) && !window.MSStream;
      const is_ios = /iPad|iPhone|iPod/.test(nua) && !window.MSStream;
      if (!is_android && !is_ios) return null;

      return (
        <div className="app-download-wrap">
          { is_android && (
            <a href='https://play.google.com/store/apps/details?id=com.gazar.am.mobile&utm_source=gazar.am' target="_blank"><img alt='Get it on Google Play' src={GooglePlayIcon} /></a>
          )}

          { is_ios && (
            <a href='https://itunes.apple.com/am/app/gazar-am/id1450797729?utm_source=gazar.am' target="_blank"><img alt='Download on App Store' src={AppStoreIcon} /></a>
          )}
          <div className="dropdown-divider" />
          <div>
            <a onClick={this.handleClose}><Translate W='CLOSE' /></a>
          </div>
        </div>
      )
    }

    return null;
  }
}

export default AppDownloadFooter;
