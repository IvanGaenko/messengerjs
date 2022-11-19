// Imports
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// App Imports
import routes from '../../setup/routes';

function RoutePrivate({ component, ...props }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? (
    <Route {...props} component={component} />
  ) : (
    <Navigate to={routes.userLogin.path} />
  );
}

export default RoutePrivate;
