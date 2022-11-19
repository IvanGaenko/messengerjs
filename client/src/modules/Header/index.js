// Imports
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// UI Imports
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

// App Imports
import routes from '../../setup/routes';
import { logout } from '../../api/actions/auth';

const Header = (classes) => {
  // state
  const { isAuthenticated, details } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // on click logout
  const onClickLogout = () => {
    let check = window.confirm('Are you sure you want to logout?');

    if (check) {
      dispatch(logout());
    }
  };
  // render
  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title}>
            <Link to={routes.home.path}>Home</Link>
          </Typography>

          {isAuthenticated ? (
            <>
              <Button
                component={Link}
                to={routes.userProfile.path}
                color="inherit"
              >
                {details.username}
              </Button>

              <Button color="inherit" onClick={onClickLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to={routes.userLogin.path}
                color="inherit"
              >
                Login
              </Button>

              <Button
                component={Link}
                to={routes.userSignup.path}
                color="inherit"
              >
                Signup
              </Button>
            </>
          )}
          <span>isAuthenticated: {isAuthenticated.toString()}</span>
        </Toolbar>
      </AppBar>
    </div>
  );
};

// Component Properties
Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
