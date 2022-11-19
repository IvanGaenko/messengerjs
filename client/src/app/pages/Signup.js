import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AuthService from '../services/auth.service';
import { getCurrent } from '../slices/user.slice';

const Signup = () => {
  const [user, setUser] = useState({
    email: '',
    username: '',
    password: '',
    repeatPassword: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const onSignup = async (event) => {
    event.preventDefault();

    if (user.email && user.password && user.password === user.repeatPassword) {
      try {
        await AuthService.makeSignup({
          email: user.email,
          username: user.username,
          password: user.password,
        });
        dispatch(getCurrent());
        navigate('/profile');
      } catch (err) {
        console.log('err', err);
        setError(err.message);
      }
    }
  };

  return (
    <>
      <p>Signup</p>
      <form onSubmit={onSignup}>
        <input
          type="username"
          name="username"
          value={user.username}
          onChange={onChange}
          label="Username"
          placeholder="Enter username"
          required={true}
          autoFocus
        />

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

        <input
          name="repeatPassword"
          type="password"
          value={user.repeatPassword}
          onChange={onChange}
          label="Repeat Password"
          placeholder="Repeat Password"
          required={true}
        />

        <input type="submit" />
        <p>{error}</p>
      </form>
    </>
  );
};

export default Signup;
