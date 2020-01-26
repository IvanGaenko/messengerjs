// Imports
import React from 'react';
import { withRouter } from 'react-router-dom';

// App Imports
import Header from './Header';

// Component
const Layout = ({ children }) => {
  // render
  return (
    <div>
      {/* Header */}
      <Header />
      {/* Body */}
      <main>{children}</main>
    </div>
  );
};

export default withRouter(Layout);
