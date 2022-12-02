import jwt from 'jsonwebtoken';
// import GlobalError from '../lib/GlobalError';
import { jwtAccSecret } from '../config/env';
import { findUser } from '../services/account.service';

export const jwtAuth = async (req, res, next) => {
  const headerToken = req.headers.authorization;
  console.log('jwtAuth headerToken', headerToken);

  if (!headerToken) {
    // return next(new GlobalError('You are not logged in', 401));
    return res.status(401).json({
      success: false,
      message: 'You are not logged in.',
      data: {},
    });
  }

  const [, token] = headerToken.split(' ');

  if (!token) {
    // return next(new GlobalError('You are not logged in', 401));
    return res.status(401).json({
      success: false,
      message: 'You are not logged in.',
      data: {},
    });
  }

  const decoded = jwt.verify(token, jwtAccSecret);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
      data: {},
    });
  }

  const freshUser = await findUser(decoded.email);

  if (!freshUser) {
    // return next(new GlobalError('user from does not exist', 401));
    return res.status(401).json({
      success: false,
      message: 'User does not exist.',
      data: {},
    });
  }

  if (
    decoded.username !== freshUser.username ||
    decoded.email !== freshUser.email
  ) {
    // return next(
    //   new GlobalError(
    //     'You are not logged in, please login with correct details',
    //     401,
    //   ),
    // );
    return res.status(401).json({
      success: false,
      message: 'You are not logged in, please login with correct details.',
      data: {},
    });
  }

  const nowTime = Math.floor(new Date().getTime() / 1000);

  if (decoded.exp <= nowTime) {
    // return next(new GlobalError('Your token is expired date', 401));
    return res.status(401).json({
      success: false,
      message: 'Your token is expired date.',
      data: {},
    });
  }

  req.body.user = freshUser.toJSON();

  next();
};
