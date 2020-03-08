// Imports
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// App Imports
import auth from '../api/state/authState';
import chat from '../api/state/chatState';
import typers from '../api/state/typeState';

const rootReducer = combineReducers({
  auth,
  chat,
  typers,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);
