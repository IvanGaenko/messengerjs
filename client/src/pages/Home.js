// Imports
import React from 'react';
import { Link } from 'react-router-dom';

// App Imports
import routes from '../setup/routes';
import AuthCheck from '../modules/auth/AuthCheck';

// Component
function Home(props) {
  return (
    <div>
      <Link to={routes.admin.path}>Admin</Link>
      <Link to={routes.userLogin.path}>Login</Link>
      <Link to={routes.userProfile.path}>Profile</Link>
      <Link to={routes.chat.path}>Chat</Link>
      <p>Home Page</p>

      <AuthCheck />
    </div>
  );
}

export default Home;
