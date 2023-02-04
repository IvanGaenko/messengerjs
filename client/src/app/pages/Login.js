import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import AuthService from '../services/auth.service';
import { getCurrent } from '../slices/user.slice';

const Login = () => {
  const { message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      .catch((err) => console.log('data', err))
      // .then((data) => {
      .then(() => {
        // navigate(`/${data.username}`);
        navigate('/');
      });
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <div className="mb-4 text-2xl tracking-tight text-gray-200">
        Sign in to Chat
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-80 mx-auto border border-solid border-gray-700 rounded-md p-4 text-sm bg-gray-800"
      >
        <label htmlFor="email" className="block mb-2 font-normal text-gray-200">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          // placeholder="Enter email"
          autoFocus="autofocus"
          className="block w-full rounded mt-1 mb-0 px-3 py-1 text-sm text-gray-200 border border-solid border-gray-600 bg-gray-900 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 invalid:border-pink-500"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500">{formik.errors.email}</div>
        ) : null}

        <label
          htmlFor="password"
          className="block mb-2 font-normal text-gray-200 mt-4"
        >
          Password
        </label>
        <input
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          // placeholder="Enter password"
          className="block w-full rounded mt-1 mb-0 px-3 py-1 text-sm text-gray-200 border border-solid border-gray-600 bg-gray-900 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 invalid:border-pink-500 placeholder-slate-400"
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="text-red-500">{formik.errors.password}</div>
        ) : null}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="block w-full mt-4 px-3 py-1.5 rounded-md text-white font-medium bg-green-700 hover:bg-green-600 border border-solid border-gray-500"
        >
          {formik.isSubmitting ? 'Sign In...' : 'Sign In'}
        </button>
        {message && <p className="text-red-500">{message}</p>}
      </form>
      <p className="w-80 p-4 mt-4 rounded-md text-center text-gray-200 border border-solid border-gray-600">
        New to Chat?{' '}
        <Link to="/signup" className="text-blue-500">
          Create an account
        </Link>
        .
      </p>
    </div>
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
