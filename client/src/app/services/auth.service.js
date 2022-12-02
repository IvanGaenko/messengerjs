import axios from 'axios';
import {
  load as fpPromise,
  hashComponents,
} from '@fingerprintjs/fingerprintjs';
// import { redirect } from 'react-router-dom';

import { store } from '../store';
import { socket } from '../socket';
import { Http } from './http.init';
import { setCurrentUser } from '../slices/user.slice';
import { setToken } from '../slices/auth.slice';
import { ResponseWrapper, ErrorWrapper } from './util';

const API_URL = 'http://localhost:3002';

let BEARER = '';

class AuthService {
  static async makeLogin({ email, password }) {
    console.log('login', email, password);
    const fingerprint = await getFingerprint();
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password, fingerprint },
        { withCredentials: true },
      );
      console.log('response', response);

      const { accessToken } = response.data.data;
      setAuthData({
        accessToken,
        exp: parseTokenData(accessToken).exp,
      });

      socket.auth.token = BEARER;
      socket.connect();

      return new ResponseWrapper(
        response,
        response.data.data,
        response.data.message,
      );
    } catch (error) {
      console.log('error', error);
      const { message } = error.response.data;
      setAuthData({
        accessToken: '',
        exp: '',
        message,
      });
      throw new ErrorWrapper(error);
    }
  }

  static async makeSignup({ email, username, password }) {
    console.log('signup', email, username, password);
    const fingerprint = await getFingerprint();
    try {
      const response = await axios.post(
        `${API_URL}/auth/signup`,
        { email, username, password, fingerprint },
        { withCredentials: true },
      );
      console.log('response', response);

      const { accessToken } = response.data.data;
      setAuthData({
        accessToken,
        exp: parseTokenData(accessToken).exp,
      });

      socket.auth.token = BEARER;
      socket.connect();

      return new ResponseWrapper(
        response,
        response.data.data,
        response.data.message,
      );
    } catch (error) {
      const { message } = error.response.data;
      setAuthData({
        accessToken: '',
        exp: '',
        message,
      });
      throw new ErrorWrapper(error);
    }
  }

  static async makeLogout() {
    try {
      const response = await new Http({ auth: true }).post(
        'auth/logout',
        {},
        { withCredentials: true },
      );

      socket.disconnect();

      resetAuthData({});

      return new ResponseWrapper(
        response,
        response.data.data,
        response.data.message,
      );
    } catch (error) {
      console.log(error);
      throw new ErrorWrapper(error);
    }
  }

  static async refreshTokens() {
    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh-tokens`,
        {
          fingerprint: await getFingerprint(),
        },
        { withCredentials: true },
      );

      console.log('response refresh', response);

      const { accessToken } = response.data.data;
      setAuthData({
        accessToken,
        exp: parseTokenData(accessToken).exp,
      });

      socket.auth.token = BEARER;
      socket.connect();

      return new ResponseWrapper(
        response,
        response.data.data,
        response.data.message,
      );
    } catch (error) {
      console.log('error', error.response.data);
      socket.disconnect();
      resetAuthData({ isError: true, message: error.response.data.message });
      throw new ErrorWrapper(error);
    }
  }

  static debounceRefreshTokens = this._debounce(() => {
    return this.refreshTokens();
  }, 100);

  static setRefreshToken(status) {
    if (['', 'true'].includes(status)) {
      console.log('set local storage', status);
      localStorage.setItem('refreshToken', status);
    }
  }

  static getBearer() {
    return BEARER;
  }

  static setBearer(accessToken) {
    BEARER = `Bearer ${accessToken}`;
  }

  static isAccessTokenExpired() {
    const state = store.getState();
    const accessTokenExpDate = state.auth.accessTokenExpDate - 10;
    console.log('accessTokenExpDate', accessTokenExpDate);
    const nowTime = Math.floor(new Date().getTime() / 1000);
    console.log('nowTime', nowTime);
    console.log('expired?', accessTokenExpDate <= nowTime);

    return accessTokenExpDate <= nowTime;
  }

  static hasRefreshToken() {
    return Boolean(localStorage.getItem('refreshToken'));
  }

  static _debounce(inner, ms = 0) {
    let timer = null;
    let resolves = [];

    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const result = inner();
        resolves.forEach((r) => r(result));
        resolves = [];
      }, ms);

      return new Promise((resolve) => resolves.push(resolve));
    };
  }
}

function setAuthData({
  accessToken = '',
  exp = '',
  message = '',
  sessionError = false,
} = {}) {
  const { dispatch } = store;
  AuthService.setRefreshToken(accessToken ? 'true' : '');
  if (accessToken) {
    AuthService.setBearer(accessToken);
  }
  dispatch(
    setToken({
      accessToken,
      accessTokenExpDate: exp,
      message,
      sessionError,
    }),
  );
}

function parseTokenData(accessToken) {
  let payload = '';
  let tokenData = {};

  try {
    payload = accessToken.split('.')[1];
    tokenData = JSON.parse(atob(payload));
  } catch (error) {
    throw new Error(error);
  }

  return tokenData;
}

async function getFingerprint() {
  const fp = await fpPromise();
  const result = await fp.get();

  const {
    plugins,
    localStorage,
    adBlock,
    screenResolution,
    availableScreenResolution,
    enumerateDevices,
    pixelRatio,
    doNotTrack,
    ...components
  } = result.components;

  if (result && result.visitorId) {
    return hashComponents([result.visitorId, components].join(''));
  }
}

function resetAuthData({ isError = false, message = '' }) {
  console.log('isError', isError, message);
  const { dispatch } = store;
  dispatch(
    setCurrentUser({
      id: null,
      username: '',
      email: '',
    }),
  );
  dispatch(
    setToken({
      accessToken: '',
      accessTokenExpDate: null,
      message,
      sessionError: isError ? true : false,
    }),
  );

  AuthService.setRefreshToken('');
  AuthService.setBearer('');
}

export default AuthService;
