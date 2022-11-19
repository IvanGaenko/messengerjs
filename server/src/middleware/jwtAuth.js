import jwt from 'jsonwebtoken';
import GlobalError from '../lib/GlobalError';
import { jwtAccSecret } from '../config/env';
import { findUser } from '../services/account.service';

export const jwtAuth = async (req, res, next) => {
  const headerToken = req.headers.authorization;

  if (!headerToken) {
    return next(new GlobalError('You are not logged in', 401));
  }

  const [, token] = headerToken.split(' ');

  const decoded = jwt.verify(token, jwtAccSecret);

  const freshUser = await findUser(decoded.email);
  if (!freshUser) {
    return next(new GlobalError('user from does not exist', 401));
  }

  if (
    decoded.username !== freshUser.username ||
    decoded.email !== freshUser.email
  ) {
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

  req.body.user = freshUser.toJSON();

  next();
};
