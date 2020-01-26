// Imports
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// App Imports
import auth from '../api/state/authState';

const rootReducer = combineReducers({
  auth,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
