import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { StickyContainer } from 'react-sticky';
import { BrowserRouter, StaticRouter, Route, Switch } from 'react-router-dom';
import { GraphQLClient } from './graph-ql';
import store from './store';
import App from './App';

const Router = process.env.REACT_APP_BUILD_SERVER ? StaticRouter : BrowserRouter;

export default ({ location, context }) => (
  <ApolloProvider client={GraphQLClient}>
    <Provider store={store}>
      <StickyContainer>
        <Router location={location} context={context}>
          <Switch>
            <Route path="/:lang(en|am|ru)" component={App} />
            <Route path="/" component={App} />
          </Switch>
        </Router>
      </StickyContainer>
    </Provider>
  </ApolloProvider>
);
