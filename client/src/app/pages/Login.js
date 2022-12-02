import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AuthService from '../services/auth.service';
import { getCurrent } from '../slices/user.slice';
import { socket } from '../socket';

const Login = () => {
  const { accessToken, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('error', (err) => {
      console.log('connect_error', err);
    });
    return () => {
      socket.off('error');
    };
  });

  const schema = Yup.object().shape({
    email: Yup.string().email().required('Email is a required field'),
    password: Yup.string().required('Password is a required field'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: (values) => onLogin(values),
  });

  const onLogin = async (values) => {
    const { email, password } = values;
    formik.values.password = '';
    await AuthService.makeLogin({
      email,
      password,
    });

    dispatch(getCurrent())
      .unwrap()
      .then((data) => {
        // console.log('login token', socket.auth);
        // socket.auth.token = accessToken;
        // socket.connect();
        navigate(`/${data.username}`);
      });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        type="email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        placeholder="Enter email"
      />
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}

      <label htmlFor="password">Password:</label>
      <input
        name="password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        placeholder="Enter passwrod"
      />
      {formik.touched.password && formik.errors.password ? (
        <div>{formik.errors.password}</div>
      ) : null}

      <button type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? 'Sign In...' : 'Sign In'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );

  // <form onSubmit={onLogin}>
  //   <input
  //     type="email"
  //     name="email"
  //     value={user.email}
  //     onChange={onChange}
  //     label="Email"
  //     placeholder="Enter email"
  //     required={true}
  //     autoFocus
  //   />

  //   <input
  //     name="password"
  //     type="password"
  //     value={user.password}
  //     onChange={onChange}
  //     label="Password"
  //     placeholder="Enter passwrod"
  //     required={true}
  //   />

  //   <input type="submit" />
  //   <p>{error}</p>
  // </form>
};

export default Login;
