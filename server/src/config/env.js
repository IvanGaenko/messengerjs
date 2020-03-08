// Imports
import dotenv from 'dotenv';

// Load .env
dotenv.config();
if (!dotenv) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

//Envronment
export const node_env = process.env.NODE_ENV;

// Security
export const jwtSecret = process.env.JWT_SECRET;
export const salt_rows = parseInt(process.env.SALT_ROWS, 10);

// Port
export const port = parseInt(process.env.DB_PORT, 10);

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
export const api_url = process.env.API_URL;
export const web_url = process.env.WEB_URL;

// CORS whitelist
export const CORS_whitelist = [api_url, web_url];

// Default language
export const language = {
  default: 'en-Us',
};
