import jwt from 'jsonwebtoken';
import GlobalError from '../lib/GlobalError';
import { jwtAccSecret } from '../config/env';
import { findUser } from '../services/account.service';

export default async (socket, next) => {
  const socketToken = socket.handshake.auth
    ? socket.handshake.auth.token
    : null;
  console.log('no error?-------------------------------', socketToken);

  if (!socketToken) {
    return next(new GlobalError('You are not logged in', 401));
    // return res.status(401).json({
    //   success: false,
    //   message: 'You are not logged in.',
    //   data: {},
    // });
  }
  console.log('--------------------------');
  const [, token] = socketToken.split(' ');

  try {
    const decoded = jwt.verify(
      token === undefined ? socketToken : token,
      jwtAccSecret,
    );

    const freshUser = await findUser(decoded.email);

    const { id, username, email } = freshUser.toJSON();

    if (!id) {
      return next(new GlobalError('user from does not exist', 401));
    }

    if (decoded.username !== username || decoded.email !== email) {
      return next(
        new GlobalError(
          'You are not logged in, please login with correct details',
          401,
        ),
      );
    }

    const nowTime = Math.floor(new Date().getTime() / 1000);

    if (decoded.exp <= nowTime) {
      return next(new GlobalError('Your token is expired date', 401));
    }

    socket.user = {
      id,
      username,
      email,
    };

    next();
  } catch (error) {
    console.log('error', error);
    return next(new GlobalError(error.message, error.status));
  }
};
