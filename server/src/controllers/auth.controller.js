import ms from 'ms';
import { v4 as uuidv4 } from 'uuid';

import { jwtRtExpires } from '../config/env';
import createCookie from '../lib/createCookie';
import { hashPassword } from '../lib/passwordOp';
import {
  findOrCreateUser,
  findByRefreshToken,
  findByPk,
  removeRefreshSession,
} from '../services/account.service';
import { addRefreshSession } from '../lib/addRefreshSession';
import { makeAccessToken } from '../lib/makeAccessToken';

export const loginController = async (req, res) => {
  const { user, fingerprint } = req.body;
  console.log('user', user);
  const refTokenExpiresInMilliseconds = new Date().getTime() + ms(jwtRtExpires);
  const refTokenExpiresInSeconds = parseInt(
    refTokenExpiresInMilliseconds / 1000,
  );

  const newRefreshSession = {
    userId: user.id,
    refreshToken: uuidv4(),
    fingerprint,
    expiresIn: refTokenExpiresInMilliseconds,
  };

  console.log('newRefreshSession login', newRefreshSession);

  await addRefreshSession(newRefreshSession);

  const accessToken = makeAccessToken(user);

  createCookie(
    res,
    newRefreshSession.refreshToken,
    '__rt',
    refTokenExpiresInSeconds,
  );

  return res.status(200).json({
    success: true,
    status: 'success',
    message: 'Login successfully',
    data: {
      accessToken,
    },
  });
};

export const signupController = async (req, res) => {
  const { email, username, password, fingerprint } = req.body;
  const refTokenExpiresInMilliseconds = new Date().getTime() + ms(jwtRtExpires);
  const refTokenExpiresInSeconds = parseInt(
    refTokenExpiresInMilliseconds / 1000,
  );

  const hashedPassword = await hashPassword(password);
  const formattedEmail = email.toLowerCase();

  const [account, created] = await findOrCreateUser({
    username,
    email: formattedEmail,
    password: hashedPassword,
  });

  if (!created) {
    return res.status(400).json({
      status: 'fail',
      message: 'user already exist',
    });
  }

  const user = account.toJSON();

  const newRefreshSession = {
    userId: user.id,
    refreshToken: uuidv4(),
    fingerprint,
    expiresIn: refTokenExpiresInMilliseconds,
  };

  console.log('newRefreshSession', newRefreshSession);

  await addRefreshSession(newRefreshSession);

  const accessToken = makeAccessToken(user);

  createCookie(
    res,
    newRefreshSession.refreshToken,
    '__rt',
    refTokenExpiresInSeconds,
  );

  return res.status(201).json({
    status: 'success',
    message: 'user successfully created',
    data: {
      accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  console.log('req headers', req.headers);
  const refreshToken = req.cookies.__rt;

  if (!refreshToken) {
    throw new Error('Refresh token not provided');
  }

  await removeRefreshSession(refreshToken);

  res.clearCookie('__rt');

  return res.status(200).json({
    success: true,
    status: 'success',
    message: 'User is logged out from current session.',
    data: {},
  });
};

export const refreshTokensController = async (req, res) => {
  const reqRefreshToken = req.cookies.__rt || req.body.__rt;
  const reqFingerprint = req.body.fingerprint;

  if (!reqRefreshToken) {
    throw new Error('Refresh token not provided');
  }

  const refTokenExpiresInMilliseconds = new Date().getTime() + ms(jwtRtExpires);
  const refTokenExpiresInSeconds = parseInt(
    refTokenExpiresInMilliseconds / 1000,
  );

  const oldRefreshSession = await findByRefreshToken(reqRefreshToken);
  await removeRefreshSession(reqRefreshToken);

  console.log('oldRefreshSession', oldRefreshSession);

  const nowTime = new Date().getTime();
  if (nowTime > oldRefreshSession.expiresIn) {
    throw new Error('session expired');
  }

  if (oldRefreshSession.fingerprint !== reqFingerprint) {
    throw new Error('invalid refresh session');
  }

  const user = await findByPk(oldRefreshSession.userId);

  const newRefreshSession = {
    userId: user.id,
    refreshToken: uuidv4(),
    fingerprint: reqFingerprint,
    expiresIn: refTokenExpiresInMilliseconds,
  };

  console.log('newRefreshSession', newRefreshSession);

  await addRefreshSession(newRefreshSession);

  const accessToken = makeAccessToken(user);

  createCookie(
    res,
    newRefreshSession.refreshToken,
    '__rt',
    refTokenExpiresInSeconds,
  );

  return res.status(201).json({
    success: true,
    status: 'success',
    message: 'tokens updated',
    data: {
      accessToken,
    },
  });
};
