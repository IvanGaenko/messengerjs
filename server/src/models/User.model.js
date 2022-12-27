// const { DataTypes } = require('sequelize');
// import { DataTypes } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lastActivity: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    // fingerprint: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // expiresIn: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    // },
    // refreshToken: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // photoURL: { type: DataTypes.STRING, allowNull: true },
    // changedPassword: { type: DataTypes.STRING, allowNull: true },
    // role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
  });

  return User;
};
