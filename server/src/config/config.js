// Imports
import { DB_USERNAME, DB_PASSWORD, DB_NAME } from '../config';

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};
