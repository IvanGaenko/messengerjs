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
  console.log('time', new Date().getTime());
  const refTokenExpiresInMilliseconds = new Date().getTime() + ms(jwtRtExpires);
  const refTokenExpiresInSeconds = parseInt(
    refTokenExpiresInMilliseconds / 1000,
  );

  const newRefreshSession = {
    userId: user.id,
    refreshToken: uuidv4(),
    fingerprint,
    expiresIn: refTokenExpiresInMilliseconds,
    lastActivity: new Date().getTime(),
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

  // const hashedPassword = await hashPassword(password);
  // const formattedEmail = email.toLowerCase();

  const [account, created] = await findOrCreateUser({
    username,
    email: email.toLowerCase(),
    password: await hashPassword(password),
  });

  if (!created) {
    return res.status(400).json({
      success: false,
      message: 'User already exist. Please sign in.',
      data: {},
    });
  }

  const user = account.toJSON();

  const newRefreshSession = {
    userId: user.id,
    refreshToken: uuidv4(),
    fingerprint,
    expiresIn: refTokenExpiresInMilliseconds,
    lastActivity: new Date().getTime(),
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
    message: 'User successfully created.',
    data: {
      accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  console.log('req cookie', req.signedCookies);
  // const refreshToken = req.cookies.__rt;
  const refreshToken = req.signedCookies.__rt || req.cookies.__rt;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token not provided.',
      data: {},
    });
    // throw new Error('Refresh token not provided');
  }

  await removeRefreshSession(refreshToken);

  res.clearCookie('__rt');

  return res.status(200).json({
    success: true,
    message: 'User is logged out from current session.',
    data: {},
  });
};

export const refreshTokensController = async (req, res) => {
  const reqRefreshToken = req.signedCookies.__rt || req.cookies.__rt;
  // req.cookies.__rt || req.body.__rt || req.signedCookies.__rt;
  const reqFingerprint = req.body.fingerprint;

  if (!reqRefreshToken) {
    // throw new Error('Refresh token not provided');
    return res.status(400).json({
      success: false,
      message: 'Refresh token not provided.',
      data: {},
    });
  }

  const refTokenExpiresInMilliseconds = new Date().getTime() + ms(jwtRtExpires);
  const refTokenExpiresInSeconds = parseInt(
    refTokenExpiresInMilliseconds / 1000,
  );

  const oldRefreshSession = await findByRefreshToken(reqRefreshToken);

  if (!oldRefreshSession) {
    return res.status(400).json({
      success: false,
      message: 'Session error. Please sign in.',
      data: {},
    });
  }

  await removeRefreshSession(reqRefreshToken);

  console.log('oldRefreshSession', oldRefreshSession);

  const nowTime = new Date().getTime();
  if (nowTime > oldRefreshSession.expiresIn) {
    // throw new Error('session expired');
    return res.status(400).json({
      success: false,
      message: 'Session expired. Please sign in.',
      data: {},
    });
  }

  if (oldRefreshSession.fingerprint !== reqFingerprint) {
    // throw new Error('invalid refresh session');
    return res.status(400).json({
      success: false,
      message: 'Invalid refresh session.',
      data: {},
    });
  }

  const user = await findByPk(oldRefreshSession.userId);

  const newRefreshSession = {
    userId: user.id,
    refreshToken: uuidv4(),
    fingerprint: reqFingerprint,
    expiresIn: refTokenExpiresInMilliseconds,
    lastActivity: new Date().getTime(),
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
    // status: 'success',
    message: 'Tokens updated.',
    data: {
      accessToken,
    },
  });
};
