import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AuthService from '../services/auth.service';

const ProtectedRoute = ({ redirectPath = 'login' }) => {
  const { accessToken, sessionError } = useSelector((state) => state.auth);

  if (!accessToken && AuthService.hasRefreshToken()) {
    return <p>Loading...</p>;
  }

  if (!accessToken && !AuthService.hasRefreshToken()) {
    return <Navigate to={redirectPath} replace />;
  }

  if (sessionError) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
