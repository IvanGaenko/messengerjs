import * as auth from './auth.controller';
import * as room from './room.controller';
import * as message from './message.controller';
import * as user from './user.controller';

export default {
  ...auth,
  ...room,
  ...message,
  ...user,
};
