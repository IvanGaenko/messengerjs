'use strict';
module.exports = (sequelize, DataTypes) => {
  const AuthDatabase = sequelize.define(
    'AuthDatabase',
    {
      email: { type: DataTypes.STRING, allowNull: false },
      name: DataTypes.STRING,
      password: { type: DataTypes.STRING, allowNull: false },
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpires: DataTypes.DATE,
    },
    {},
  );
  // AuthDatabase.beforeSave
  AuthDatabase.associate = function(models) {
    // associations can be defined here
    AuthDatabase.hasMany(models.ChatMessage, {
      foreignKey: 'chatRoomId',
      sourceKey: 'id',
    });

    AuthDatabase.hasMany(models.ChatMessage, {
      foreignKey: 'author',
      sourceKey: 'name',
    });
  };
  return AuthDatabase;
};
