// Imports
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// UI Imports
import { withStyles } from '@material-ui/core/styles/index';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styles from './styles';

// App Imports
import routesUser from '../../setup/routes/user';
import { signup } from '../../api/actions/auth';
// import AuthCheck from '../../modules/auth/AuthCheck';

// Component
const Signup = ({ history, classes }) => {
  // state
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
  });
  const { isLoading } = useSelector((state) => state.auth);
  const [passwordError, setPasswordError] = useState('');

  // on signup
  const onSignup = async (event) => {
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
  const onChange = (event) => {
    // console.log('event.target.value', event.target.name);
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  // render
  return (
    <div className={classes.root}>
      <p>Don&apos;t have an account? Please signup: fuck</p>
      <form onSubmit={onSignup} className={classes.signupForm}>
        {/* Input - name */}
        <p>Username:</p>
        <Input
          label="Full name"
          name="username"
          value={user.username}
          onChange={onChange}
          placeholder="Enter full name"
          required={true}
          autoFocus
        />
        {/* Input - email */}
        <p>Email:</p>
        <Input
          name="email"
          type="email"
          value={user.email}
          onChange={onChange}
          label="Email"
          placeholder="Enter email"
          required={true}
        />
        {/* Input - password */}
        <p>Password:</p>
        <Input
          name="password"
          type="password"
          value={user.password}
          onChange={onChange}
          label="Password"
          placeholder="Enter password"
          required={true}
        />
        {/* Input - password repeat */}
        <p>Repeat password:</p>
        <Input
          name="passwordRepeat"
          type="password"
          value={user.passwordRepeat}
          onChange={onChange}
          label="Repeat Password"
          placeholder="Enter password again"
          required={true}
        />
        {/* Button - save */}
        <Button type="submit" disabled={isLoading}>
          Send
        </Button>
      </form>
      {passwordError}
    </div>
  );
};

Signup.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.shape().isRequired,
};

export default withStyles(styles)(Signup);
