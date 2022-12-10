// Imports
import Joi from '@hapi/joi';
import dotenv from 'dotenv';

// Load .env
dotenv.config();
if (!dotenv) {
  throw new Error('⚠️  Couldn\'t find .env file  ⚠️');
}

const options = {
  NODE_ENV: Joi.string().default('development'),
  DB_PORT: Joi.string().default(3000),
  SERVER_PORT: Joi.string().default(3000),
  API_URL: Joi.string(),
  WEB_URL: Joi.string(),
  COOKIE_SECRET_KEY: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  RT_SECRET: Joi.string().required(),
  SALT_ROWS: Joi.number().integer(),
  DB_USERNAME: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_NAME: Joi.string(),
};

const schema = Joi.object(options).unknown().required();

const { error, value: config } = schema.validate(process.env);

if (error) {
  console.error('Missing property in config.', error.message);
  process.exit(1);
}

module.exports = config;
