import admin from './admin';
import home from './home';
import user from './user';
import chat from './chat';
import auth from './auth';

const routes = {
  ...admin,
  ...home,
  ...user,
  ...chat,
  ...auth,
};

export default routes;
