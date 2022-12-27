// import React from 'react';
import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRouter';

import AppLayout from '../layout';
import Profile from '../pages/Profile';
import Chat from '../pages/Chat';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route element={<PublicRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="chat" replace />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
        <Route path=":username" element={<Profile />} />
      </Route>

      <Route path="*" element={<p>There&apos;s nothing here: 404!</p>} />
    </Route>,
  ),
);

export default router;
