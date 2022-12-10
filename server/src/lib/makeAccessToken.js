import jwt from 'jsonwebtoken';
import {
  jwtAccSecret,
  jwtRtSecret,
  jwtAccExpires,
  jwtRtExpires,
  accessTokenType,
  refreshTokenType,
  jwtIss,
} from '../config/env';

export function makeAccessToken(user) {
  const config = {
    payload: {
      tokenType: accessTokenType,
      username: user.username,
      email: user.email,
      iss: jwtIss,
    },

    options: {
      algorithm: 'HS512',
      subject: user.username,
      expiresIn: jwtAccExpires,
    },
  };
  return jwt.sign(config.payload, jwtAccSecret, config.options);
}

export function makeRefreshToken(user) {
  const config = {
    payload: {
      tokenType: refreshTokenType,
      username: user.username,
      email: user.email,
      iss: jwtIss,
    },

    options: {
      algorithm: 'HS512',
      subject: user.username,
      expiresIn: jwtRtExpires,
    },
  };
  return jwt.sign(config.payload, jwtRtSecret, config.options);
}
