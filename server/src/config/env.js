// Imports
import {
  NODE_ENV,
  SERVER_PORT,
  JWT_SECRET,
  RT_SECRET,
  JWT_ACCESS_EXPIRES,
  JWT_REFRESH_EXPIRES,
  COOKIE_ACCESS_EXPIRES,
  COOKIE_REFRESH_EXPIRES,
  SALT_ROWS,
  API_URL,
  WEB_URL,
} from '.';

//Envronment
export const node_env = NODE_ENV;

// Security
export const jwtAccSecret = JWT_SECRET;
export const jwtRtSecret = RT_SECRET;
export const jwtAccExpires = JWT_ACCESS_EXPIRES;
export const jwtRtExpires = JWT_REFRESH_EXPIRES;
export const cookieAccExpires = COOKIE_ACCESS_EXPIRES;
export const cookieRtExpires = COOKIE_REFRESH_EXPIRES;
export const maxRefreshSessionsCount = 5;
export const salt_rows = parseInt(SALT_ROWS, 10);
export const accessTokenType = 'AccessToken';
export const refreshTokenType = 'RefreshToken';
export const jwtIss = 'messengerjs';

// Port
export const port = parseInt(SERVER_PORT, 10);

// Api Path
export const api = { prefix: '/' };
export const endpoint = { url: '/', auth: '/auth' };

// Roles
export const roles = {
  admin: {
    key: 'admin',
  },
  user: {
    key: 'user',
  },
};

// Login/Signup rules
export const rules = {
  nameMinLength: 3,
  passwordMinLength: 6,
};

// URL
export const api_url = API_URL;
export const web_url = WEB_URL;

// CORS whitelist
export const CORS_whitelist = [api_url, web_url, '/'];
