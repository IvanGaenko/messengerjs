// Imports
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

// App Imports
import routes from '../../setup/routes';

function RoutePrivate({ component, ...props }) {
  const { isAuthenticated } = useSelector(state => state.auth);

  return isAuthenticated ? (
    <Route {...props} component={component} />
  ) : (
    <Redirect to={routes.userLogin.path} />
  );
}

export default RoutePrivate;
