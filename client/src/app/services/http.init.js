import axios from 'axios';

import AuthService from './auth.service';
const API_URL = 'http://localhost:3002';

export class Http {
  constructor(status) {
    this.isAuth = status && status.auth ? status.auth : false;
    this.instance = axios.create({
      baseURL: API_URL,
    });

    return this.init();
  }

  init() {
    // console.log('entering http');
    if (this.isAuth) {
      this.instance.interceptors.request.use(
        (request) => {
          request.headers.authorization = AuthService.getBearer();
          // console.log('header', request.headers.authorization);
          if (
            AuthService.isAccessTokenExpired() &&
            AuthService.hasRefreshToken()
          ) {
            return AuthService.debounceRefreshTokens()
              .then((response) => {
                // console.log('new refresh token', response);
                AuthService.setBearer(response.data.accessToken);
                request.headers.authorization = AuthService.getBearer();
                return request;
              })
              .catch((error) => Promise.reject(error));
          } else {
            return request;
          }
        },
        (error) => {
          // console.log('error', error);
          return Promise.reject(error);
        },
      );
    }

    return this.instance;
  }
}
