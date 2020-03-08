// Imports
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import isEmpty from 'lodash/isEmpty';

// App Imports
import { login } from '../api/actions/auth';
import AuthCheck from '../modules/auth/AuthCheck';
import routes from '../setup/routes';

function Login(props) {
  // state
  const [user, setUser] = useState({ email: '', password: '' });
  const { isLoading, error, isAuthenticated } = useSelector(
    state => state.auth,
  );
  const dispatch = useDispatch();

  // on login
  const onLogin = async event => {
    event.preventDefault();

    if (!isEmpty(user.email) && !isEmpty(user.password)) {
      dispatch(login(user));
    }
  };

  // on change
  const onChange = event => {
    setUser({
      ...user,
      [event.target.name]: event.target.value.trim(),
    });
  };

  // on success login
  if (isAuthenticated) {
    return <Redirect to={routes.home.path} />;
  }

  return (
    <div style={{ textAlign: 'center', margin: '30vh auto', width: '70%' }}>
      <Link to={routes.admin.path}>Admin</Link>
      <Link to={routes.userProfile.path}>Profile</Link>
      <p>Already have an account? Please login:</p>
      <form onSubmit={onLogin}>
        {/* Input - email */}
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={onChange}
          label="Email"
          placeholder="Enter email"
          required={true}
          autoFocus
        />

        {/* Input - password */}
        <input
          name="password"
          type="password"
          value={user.password}
          onChange={onChange}
          label="Password"
          placeholder="Enter passwrod"
          required={true}
        />
        {/* Button - save */}
        <input type="submit" disabled={isLoading} />
      </form>
      {error}
      <div>
        <Link to={routes.userSignup.path}>
          Not have an account? Please sign up.
        </Link>
      </div>

      {/* Auth Check */}
      <AuthCheck />
    </div>
  );
}

export default Login;
