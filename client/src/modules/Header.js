// Imports
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// App Imports
import routes from '../setup/routes';
import { logout } from '../api/actions/auth';
// import UnreadMessageCount from './../pages/UnreadMessageCount';

const Header = () => {
  // state
  const { isAuthenticated, details } = useSelector(state => state.auth);
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
    <div>
      <div>
        {isAuthenticated ? (
          <div>
            <button onClick={onClickLogout}>Log out</button>
            {details.name}
            <Link to={routes.userProfile.path}>Profile</Link>
          </div>
        ) : (
          <button component={Link} to={routes.userLogin.path}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default withRouter(Header);
