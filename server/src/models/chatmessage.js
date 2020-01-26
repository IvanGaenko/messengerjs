'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define(
    'ChatMessage',
    {
      chatRoomId: DataTypes.INTEGER,
      author: DataTypes.STRING,
      message: DataTypes.TEXT,
    },
    {},
  );
  ChatMessage.associate = function(models) {
    // associations can be defined here
    // ChatMessage.belongsTo(models.ChatRoom, {
    //   foreignKey: 'chatRoomId',
    //   targetKey: 'id',
    // });
    ChatMessage.belongsTo(models.AuthDatabase, {
      foreignKey: 'chatRoomId',
      targetKey: 'id',
    });

    ChatMessage.belongsTo(models.AuthDatabase, {
      foreignKey: 'author',
      targetKey: 'name',
    });
  };
  return ChatMessage;
};
