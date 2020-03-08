import * as auth from './AuthController';
import * as room from './RoomController';
import * as message from './MessageController';
import * as user from './UserController';

export default {
  ...auth,
  ...room,
  ...message,
  ...user,
};
