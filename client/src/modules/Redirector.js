// Imports
import React from 'react';
import { Navigate } from 'react-router-dom';

// App Imports
import routes from '../setup/routes/index';

// Component
const Redirector = ({ path = routes.home.path }) => <Navigate to={path} />;

export default Redirector;
