import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import AuthService from '../services/auth.service';
import { getCurrent } from '../slices/user.slice';
// import socket from '../socket';

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
      .catch((err) => console.log('data', err))
      .then((data) => {
        // socket.init();
        navigate(`/${data.username}`);
      });
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center bg-gray-900">
      <div className="mb-4 text-2xl tracking-tight text-gray-200">
        Sign up to Chat
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-80 mx-auto border border-solid border-gray-700 rounded-md p-4 text-sm bg-gray-800"
      >
        <label htmlFor="email" className="block mb-2 font-normal text-gray-200">
          Username
        </label>
        <input
          type="username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          // placeholder="Enter username"
          autoFocus="autofocus"
          className="block w-full rounded mt-1 mb-0 px-3 py-1 text-sm text-gray-200 border border-solid border-gray-600 bg-gray-900 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 invalid:border-pink-500"
        />
        {formik.touched.username && formik.errors.username ? (
          <div className="text-red-500">{formik.errors.username}</div>
        ) : null}

        <label
          htmlFor="email"
          className="block mb-2 font-normal text-gray-200 mt-4"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          // placeholder="Enter email"
          className="block w-full rounded mt-1 mb-0 px-3 py-1 text-sm text-gray-200 border border-solid border-gray-600 bg-gray-900 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 invalid:border-pink-500 placeholder-slate-400"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500">{formik.errors.email}</div>
        ) : null}

        <label
          htmlFor="password"
          className="block mb-2 font-normal text-gray-200 mt-4"
        >
          Password:
        </label>
        <input
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          // placeholder="Enter passwrod"
          className="block w-full rounded mt-1 mb-0 px-3 py-1 text-sm text-gray-200 border border-solid border-gray-600 bg-gray-900 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 invalid:border-pink-500 placeholder-slate-400"
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="text-red-500">{formik.errors.password}</div>
        ) : null}

        <label
          htmlFor="repeatPassword"
          className="block mb-2 font-normal text-gray-200 mt-4"
        >
          Repeat Password:
        </label>
        <input
          name="repeatPassword"
          type="password"
          value={formik.values.repeatPassword}
          onChange={formik.handleChange}
          // placeholder="Repeat Password"
          className="block w-full rounded mt-1 mb-0 px-3 py-1 text-sm text-gray-200 border border-solid border-gray-600 bg-gray-900 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 invalid:border-pink-500 placeholder-slate-400"
        />
        {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
          <div className="text-red-500">{formik.errors.repeatPassword}</div>
        ) : null}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="block w-full mt-4 px-3 py-1.5 rounded-md text-white font-medium bg-green-700 hover:bg-green-600 border border-solid border-gray-500"
        >
          {formik.isSubmitting ? 'Sign Up...' : 'Sign Up'}
        </button>
        {message && <p className="text-red-500">{message}</p>}
      </form>
      <p className="w-80 p-4 mt-4 rounded-md text-center text-gray-200 border border-solid border-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500">
          Sign in
        </Link>
        .
      </p>
    </div>
  );
};

export default Signup;
