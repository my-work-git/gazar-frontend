import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createHttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import { getToken } from './helpers';
import { GraphQLClient } from './graph-ql';

const WS_HOST = process.env.REACT_APP_WS_HOST
  ? process.env.REACT_APP_WS_HOST
  : 'ws://localhost:4000';

let WSClient = {};
if (!process.env.REACT_APP_USE_HTTP) {
  // Create WebSocket client
  WSClient = new SubscriptionClient(`${WS_HOST}/api/ws`, {
    reconnect: true,
    connectionParams: {
      token: getToken(),
    },
  });

  let pingPongInterval = null;
  const PingQuery = gql`
    query Ping {
      ping {
        pong
      }
    }
  `;

  const runPingPong = () => {
    pingPongInterval = setInterval(async () => {
      await GraphQLClient.query({ query: PingQuery, fetchPolicy: 'network-only' });
    }, 5000);
  };

  WSClient.onConnected(runPingPong);
  WSClient.onReconnected(runPingPong);

  WSClient.onError(error => console.log(error));

  WSClient.onDisconnected(() => {
    if (pingPongInterval) {
      clearInterval(pingPongInterval);
    }

    pingPongInterval = null;
  });
}

// HTTP LINK
const HttpLink = createHttpLink({
  uri: `${WS_HOST}/api/ql`,
  headers: {
    authorization: getToken(),
  }
});

export { WSClient, HttpLink };
