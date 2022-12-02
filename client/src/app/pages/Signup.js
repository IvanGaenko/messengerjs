import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AuthService from '../services/auth.service';
import { getCurrent } from '../slices/user.slice';
import socket from '../socket';

const Signup = () => {
  const { message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required('Email is a required field')
      .email('Invalid email format'),
    username: Yup.string().required('Username is a required field'),
    password: Yup.string()
      .required('Password is a required field')
      .min(6, 'Password must be at least 6 characters'),
    repeatPassword: Yup.string()
      .required('Repeat password is a required field')
      .min(6, 'Repeat password must be at least 6 characters')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema: schema,
    onSubmit: (values) => onSignup(values),
  });

  const onSignup = async (values) => {
    const { email, username, password } = values;

    await AuthService.makeSignup({
      email,
      username,
      password,
    });

    dispatch(getCurrent())
      .unwrap()
      .then((data) => {
        socket.init();
        navigate(`/${data.username}`);
      });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="email">Username:</label>
      <input
        type="username"
        name="username"
        value={formik.values.username}
        onChange={formik.handleChange}
        placeholder="Enter username"
      />
      {formik.touched.username && formik.errors.username ? (
        <div>{formik.errors.username}</div>
      ) : null}

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

      <label htmlFor="email">Password:</label>
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

      <label htmlFor="email">Repeat Password:</label>
      <input
        name="repeatPassword"
        type="password"
        value={formik.values.repeatPassword}
        onChange={formik.handleChange}
        placeholder="Repeat Password"
      />
      {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
        <div>{formik.errors.repeatPassword}</div>
      ) : null}

      <button type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? 'Sign Up...' : 'Sign Up'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default Signup;
