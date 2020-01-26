// Imports
import React from 'react';
import { Redirect } from 'react-router-dom';

// App Imports
import routes from '../setup/routes/index';

// Component
const Redirector = ({ path = routes.home.path }) => <Redirect to={path} />;

export default Redirector;
