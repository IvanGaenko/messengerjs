// const { DataTypes } = require("sequelize");
import DataTypes from 'sequelize';

module.exports = (sequelize) => {
  sequelize.define('Conversation', {
    users: {
      type: DataTypes.STRING,
      unique: true,
    },
  });
};

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Rooms = sequelize.define(
//     'Rooms',
//     {
//       name: DataTypes.STRING,
//       raw_message: {
//         type: DataTypes.ARRAY(DataTypes.TEXT),
//         defaultValue: [],
//       },
//     },
//     {},
//   );
//   Rooms.associate = function(models) {
//     // associations can be defined here
//     Rooms.hasMany(models.Messages, {
//       foreignKey: 'chatRoomId',
//       sourceKey: 'id',
//     });
//   };
//   return Rooms;
// };
