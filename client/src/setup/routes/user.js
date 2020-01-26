import Login from '../../pages/Login';
import Signup from '../../pages/Signup';
import Profile from '../../pages/Profile';

export default {
  userLogin: {
    path: '/user/login',
    component: Login,
  },

  userSignup: {
    path: '/user/signup',
    component: Signup,
  },

  userProfile: {
    path: '/user/profile',
    component: Profile,
    auth: true,
  },
};
