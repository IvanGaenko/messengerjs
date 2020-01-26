// Imports
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// App Imports
import routesUser from '../setup/routes/user';
import { signup } from '../api/actions/auth';
import AuthCheck from '../modules/auth/AuthCheck';

// Component
const Signup = ({ history }) => {
  // state
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    passwordRepeat: '',
  });
  const { isLoading } = useSelector(state => state.auth);
  const [passwordError, setPasswordError] = useState('');

  // on signup
  const onSignup = async event => {
    event.preventDefault();

    try {
      const { data } = await signup(user);

      if (data.success) {
        history.push(routesUser.userLogin.path);
      } else {
        setPasswordError(data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  // on change
  const onChange = event => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  // render
  return (
    <div>
      <p>Don't have an account? Please signup:</p>
      <form onSubmit={onSignup}>
        {/* Input - name */}
        <input
          name="name"
          value={user.name}
          onChange={onChange}
          label="Full name"
          placeholder="Enter full name"
          required={true}
          autoFocus
        />
        {/* Input - email */}
        <input
          name="email"
          type="email"
          value={user.email}
          onChange={onChange}
          label="Email"
          placeholder="Enter email"
          required={true}
        />
        {/* Input - password */}
        <input
          name="password"
          type="password"
          value={user.password}
          onChange={onChange}
          label="Password"
          placeholder="Enter password"
          required={true}
        />
        {/* Input - password repeat */}
        <input
          name="passwordRepeat"
          type="password"
          value={user.passwordRepeat}
          onChange={onChange}
          label="Repeat Password"
          placeholder="Enter password again"
          required={true}
        />
        {/* Button - save */}
        <input type="submit" disabled={isLoading} />
      </form>
      {passwordError}

      {/* Auth Check */}
      <AuthCheck />
    </div>
  );
};

export default Signup;
