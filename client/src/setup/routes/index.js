import admin from './admin';
import home from './home';
import user from './user';
import chat from './chat';

const routes = {
  ...admin,
  ...home,
  ...user,
  ...chat,
};

export default routes;
