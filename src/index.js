import "babel-polyfill";
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
// import registerServiceWorker from './registerServiceWorker';
import BaseApp from './BaseApp';

import './fonts/ghea-font/stylesheet.css';
import './css/bootstrap.css';
import './css/font-awesome.min.css';
import './css/magnific-popup.css';
import './css/custom.css';
import './css/responsive.css';
import './index.css';
import './css/slick.min.css';
import './css/slick-theme.css';
ReactDOM.render(<BaseApp />, document.getElementById('root'));
// registerServiceWorker();
