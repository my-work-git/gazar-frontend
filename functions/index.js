const fs = require('fs');
const path = require('path');
const request = require('request');
const InternalAPIToken = "VRxywsKKc2Yhujj5WNIh";

global.window = {};
global.navigator = {};
global.fetch = require('node-fetch');
global.WebSocket = require('isomorphic-ws');
const indexFile = path.join(__dirname, 'build', 'index.html');
global.readHTMLFile = () => new Promise((resolve, reject) => {
  fs.readFile(indexFile, (error, data) => {
    if (error) return reject(error);
    resolve(data.toString());
  });
});

require('./build');
const functions = require('firebase-functions');
const express = require('express');

const app = express();

// Just running here to cache stuff
global.RenderApp('/');

const serverRenderingBots = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot'
];

const isOneOfTheBots = req => {
  let userAgent = req.get('user-agent');
  if (userAgent && userAgent.length > 0) {
    userAgent = userAgent.toLowerCase();
    for(let i = 0; i < serverRenderingBots.length; i++) {
      if (userAgent.indexOf(serverRenderingBots[i]) !== -1) {
        return true;
      }
    }
  }

  return false;
};

const renderAndSendApp = (req, res) => {
  res.set('Content-Type', 'text/html');
  // res.set('Cache-Control', 'public, max-age=1200');
  console.log("RENDERING APP -> ", indexFile, req.url);
  if (isOneOfTheBots(req)) {
    global.RenderApp(req.url).then((resText) => {
      res.send(resText);
    }).catch(e => {
      console.log("RENDER ERROR!!! -> ", e);
      res.sendFile(indexFile);
    });
  } else {
    fs.readFile(indexFile, (error, data) => {
      res.send(data.toString());
    });
  }
};

const retryRequest = (paymentId, callback, final) => {
  const query = `mutation {
    setPaymentTransaction(internalToken: "${InternalAPIToken}", paymentId: "${paymentId}") {
      error,
      message
    }
  }`;

  request({
    url: 'https://gazar-api.herokuapp.com/api/ql',
    method: "POST",
    json: { query },
    timeout: 10000,
  }, (error, response, body) => {
    if (!final) {
      setTimeout(() => retryRequest(paymentId, callback, true), 2000);
    } else {
      callback(error, response, body);
    }
  });
};

app.post('/payment/ameria-callback/:paymentId', (req, res) => {
  retryRequest(req.params.paymentId, (error, response, body) => {
    res.redirect('/payment/ameria-callback/:paymentId');
  });
});

app.get('**', renderAndSendApp);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
exports.gazarWeb = functions.https.onRequest(app);
