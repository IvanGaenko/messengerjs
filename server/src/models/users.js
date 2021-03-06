'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      friendList: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
    },
    {},
  );
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};
