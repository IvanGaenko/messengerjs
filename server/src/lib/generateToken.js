import jwt from 'jsonwebtoken';
import GlobalError from '../lib/GlobalError';
import { findByPk } from '../services/account.service';
import {
  jwtAccSecret,
  jwtRtSecret,
  jwtAccExpires,
  jwtRtExpires,
} from '../config/env';

export const refreshToken = async (__rt, next) => {
  const decoded = jwt.decode(__rt);

  if (!decoded.id) {
    return next(new GlobalError('unAutorize, please login', 401));
  }

  const freshUser = await findByPk(decoded.id);

  if (!freshUser) {
    return next(new GlobalError('user does not exist', 401));
  }

  const { id, username, password } = freshUser;
  const refreshTokenKey = jwtRtSecret + password;

  const checkRT = jwt.verify(__rt, refreshTokenKey);
  if (!checkRT) {
    return next(
      new GlobalError('you are not logged in from refreshtoken', 401),
    );
  }

  const accessToken = jwt.sign(
    {
      id,
      username,
    },
    jwtAccSecret,
    {
      expiresIn: `${jwtAccExpires}`,
    },
  );

  const newRefreshToken = jwt.sign(
    {
      id,
      username,
    },
    refreshTokenKey,
    {
      expiresIn: `${jwtRtExpires}`,
    },
  );

  if (accessToken && newRefreshToken) {
    return {
      accessToken,
      newRefreshToken,
    };
  }
};
