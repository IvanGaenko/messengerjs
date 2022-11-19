// const { DataTypes } = require("sequelize");
import DataTypes from 'sequelize';

module.exports = (sequelize) => {
  sequelize.define('Message', {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentChatReceiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Messages = sequelize.define(
//     'Messages',
//     {
//       chatRoomId: DataTypes.INTEGER,
//       author: DataTypes.STRING,
//       message: DataTypes.TEXT,
//       isRead: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//       },
//       isDeleted: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//       },
//     },
//     {},
//   );
//   Messages.associate = function(models) {
//     // associations can be defined here
//     Messages.belongsTo(models.Rooms, {
//       foreignKey: 'chatRoomId',
//       targetKey: 'id',
//     });
//   };
//   return Messages;
// };
