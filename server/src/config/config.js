require('dotenv').config();

const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

module.exports = {
  development: {
    username: db_username,
    password: db_password,
    database: db_name,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: db_username,
    password: db_password,
    database: db_name,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};
