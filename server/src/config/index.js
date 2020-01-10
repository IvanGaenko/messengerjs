import dotenv from 'dotenv';
dotenv.config();

if (!dotenv) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  port: parseInt(process.env.DB_PORT, 10),
  api: {
    prefix: '/',
  },
};
