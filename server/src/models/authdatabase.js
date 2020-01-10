'use strict';
module.exports = (sequelize, DataTypes) => {
  const AuthDatabase = sequelize.define('AuthDatabase', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE
  }, {});
  AuthDatabase.associate = function(models) {
    // associations can be defined here
  };
  return AuthDatabase;
};