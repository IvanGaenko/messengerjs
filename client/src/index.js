//Imports
import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//App Imports
// import { store } from './setup/store';
import { store } from './app/store';
// import routes from './setup/routes';
import ThemeLayout from './styles/ThemeLayout';
// import Layout from './modules/Layout';
// import Redirector from './modules/Redirector';
// import RoutePrivate from './modules/auth/RoutePrivate';
import * as serviceWorker from './serviceWorker';
import { setUser, setUserLocally } from './api/actions/auth';
import App from './App';

// User Authentication
const token = window.localStorage.getItem('token');
if (token && token !== 'undefined' && token !== '') {
  const user = JSON.parse(window.localStorage.getItem('user'));
  if (user) {
    store.dispatch(setUser(token, user));

    setUserLocally(token, user);
  }
}

const container = document.getElementById('root');
const root = createRoot(container);

//Render App
// ReactDOM.render(
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <Router> */}
      <ThemeLayout>
        {/* <Layout>
            <Routes>
              {Object.values(routes).map((route, index) =>
                route.auth ? (
                  <RoutePrivate {...route} key={index} path={route.path} />
                ) : (
                  <Route {...route} key={index} path={route.path} />
                ),
              )}

              <Route element={Redirector} />
            </Routes>
          </Layout> */}
        <App />
      </ThemeLayout>
      {/* </Router> */}
    </Provider>
  </React.StrictMode>,
);

// Service Worker
serviceWorker.unregister();
