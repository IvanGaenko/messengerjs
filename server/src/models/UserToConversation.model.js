module.exports = (sequelize, DataTypes) => {
  const userToConversation = sequelize.define('userToConversation', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: require('./User.model'),
        key: 'id',
      },
    },
    conversationId: {
      type: DataTypes.INTEGER,
      references: {
        model: require('./Conversation.model'),
        key: 'id',
      },
    },
  });
  return userToConversation;
};
