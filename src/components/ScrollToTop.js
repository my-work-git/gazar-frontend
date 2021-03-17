import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (window && this.props.location.pathname !== prevProps.location.pathname
      && !this.isProductPath(this.props.location.pathname)
      && !(this.props.location.pathname === '/shop' && this.isProductPath(prevProps.location.pathname))
    ) {
      window.scrollTo(0, 0);
    }
  }

  /**
   * This regexp checks if location matchs 'product/guid'
   */

  isProductPath = pathName => pathName.match('^(?:\\/shop/product\\b)(?:\\/[\\w]+)$');

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop);
