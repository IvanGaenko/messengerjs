import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AuthService from '../services/auth.service';
import { getCurrent } from '../slices/user.slice';

const Login = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const onLogin = async (event) => {
    event.preventDefault();
    try {
      await AuthService.makeLogin({
        email: user.email,
        password: user.password,
      });
      dispatch(getCurrent());
      navigate('/profile');
    } catch (err) {
      console.log('err', err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={onLogin}>
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

      <input
        name="password"
        type="password"
        value={user.password}
        onChange={onChange}
        label="Password"
        placeholder="Enter passwrod"
        required={true}
      />

      <input type="submit" />
      <p>{error}</p>
    </form>
  );
};

export default Login;
