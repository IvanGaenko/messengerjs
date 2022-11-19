// Imports
import React from 'react';
import PropTypes from 'prop-types';

// UI Imports
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// App Imports
import theme from './theme';

const ThemeLayout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

// Component Properties
ThemeLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeLayout;
