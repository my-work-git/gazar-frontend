import React from 'react';
import { renderToString } from 'react-dom/server';
import { getDataFromTree } from 'react-apollo';
import { GraphQLClient } from './graph-ql';
import BaseApp from './BaseApp';
import { Helmet } from 'react-helmet'

const getBaseHTML = async (content, state) => {
  const helmet = await Helmet.renderStatic();
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-MBZ262J');</script>
      <!-- End Google Tag Manager -->
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
      <meta charset="utf-8">
      <!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge"><![endif]-->
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta property="og:image" content="http://gazar.am%PUBLIC_URL%/og-cover.jpg" />
      <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
      <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.png">
      <meta name="google-site-verification" content="j3NGDln0SjzAFJylV6QlUffOB4_mHLv5_uiyX8cn19g" />
    </head>
    <body>
    <script>window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\\u003c')};</script>
      <!-- Google Tag Manager (noscript) -->
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MBZ262J"
      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
      <!-- End Google Tag Manager (noscript) -->
  
      <noscript>
        You need to enable JavaScript to run this app.
      </noscript>
  
      <div id="root">${content}</div>
      <div id="fb-root"></div>
      <script>
        window.fbAsyncInit = function() {
          FB.init({
            appId            : '282838975873729',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v3.1'
          });
        };
  
        (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.1';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));</script>
    </body>
  </html>
`;
};


global.RenderApp = async (url) => {
  const context = {};
  const app = <BaseApp location={url} context={context} />;
  await getDataFromTree(app);
  const initialState = GraphQLClient.extract();
  const content = renderToString(app);
  return await getBaseHTML(content, initialState);
};
