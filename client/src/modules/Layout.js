// Imports
import React from 'react';
import PropTypes from 'prop-types';

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

      <main>
        {children}
        <footer style={{ display: 'flex', justifyContent: 'center' }}>
          Footer
        </footer>
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.shape().isRequired,
};

export default Layout;
