//Imports
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as StateProvider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//App Imports
import { store } from './setup/store';
import routes from './setup/routes';
import Layout from './modules/Layout';
import Redirector from './modules/Redirector';
import RoutePrivate from './modules/auth/RoutePrivate';
import * as serviceWorker from './serviceWorker';
import { setUser, setUserLocally } from './api/actions/auth';

// User Authentication
const token = window.localStorage.getItem('token');
if (token && token !== 'undefined' && token !== '') {
  const user = JSON.parse(window.localStorage.getItem('user'));
  if (user) {
    store.dispatch(setUser(token, user));

    setUserLocally(token, user);
  }
}

//Render App
ReactDOM.render(
  <StateProvider store={store}>
    <Router>
      <Layout>
        <Switch>
          {Object.values(routes).map((route, index) =>
            route.auth ? (
              <RoutePrivate {...route} key={index} path={route.path} />
            ) : (
              <Route {...route} key={index} path={route.path} />
            ),
          )}

          <Route component={Redirector} />
        </Switch>
      </Layout>
    </Router>
  </StateProvider>,
  document.getElementById('root'),
);

// Service Worker
serviceWorker.unregister();
