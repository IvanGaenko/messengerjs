// Imports
import {
  NODE_ENV,
  DB_PORT,
  JWT_SECRET,
  SALT_ROWS,
  API_URL,
  WEB_URL,
} from '../config';

//Envronment
export const node_env = NODE_ENV;

// Security
export const jwtSecret = JWT_SECRET;
export const salt_rows = parseInt(SALT_ROWS, 10);

// Port
export const port = parseInt(DB_PORT, 10);

// Api Path
export const api = { prefix: '/' };
export const endpoint = { url: '/' };

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
export const CORS_whitelist = [api_url, web_url];

// Default language
export const language = {
  default: 'en-Us',
};
