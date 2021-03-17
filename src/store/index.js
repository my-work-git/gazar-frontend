import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import commonReducer from './reducers/common';
import basketReducer from './reducers/basket';

const composeEnhancers =
  (process.env.NODE_ENV === 'development' ? (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) : null) || compose;

const rootReducer = combineReducers({
  initial: commonReducer,
  basket: basketReducer,
});

const middleWares = [thunk];
if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');
  const logger = createLogger({ collapsed: ( ) => true });
  middleWares.push(logger);
}

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleWares)));

export default store;
