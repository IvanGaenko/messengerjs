function addAssociations(db) {
  const {
    user,
    refreshSession,
    conversation,
    userToConversation,
    message,
    messageByDay,
  } = db;

  // user - refreshSession
  user.hasMany(refreshSession, { as: 'refreshSessions', foreignKey: 'userId' });
  refreshSession.belongsTo(user, {
    foreignKey: 'userId',
    as: 'user',
  });

  // user - conversation
  user.belongsToMany(conversation, {
    through: userToConversation,
    as: 'conversations',
  });
  conversation.belongsToMany(user, { through: userToConversation, as: 'user' });

  // user - message
  user.hasMany(message, {
    foreignKey: 'userId',
    as: 'messages',
  });

  message.belongsTo(user, {
    foreignKey: 'userId',
    as: 'user',
  });

  conversation.hasMany(messageByDay, {
    foreignKey: 'conversationId',
    as: 'messageByDay',
  });

  messageByDay.belongsTo(conversation, {
    foreignKey: 'conversationId',
    as: 'conversations',
  });

  messageByDay.hasMany(message, {
    foreignKey: 'byDayId',
    as: 'messages',
  });

  messageByDay.hasMany(message, {
    foreignKey: 'byDayId',
    as: 'unreadedMessages',
  });

  message.belongsTo(messageByDay, {
    foreignKey: 'byDayId',
    as: 'messageByDay',
  });

  // conversation - messages
  // conversation.hasMany(message, {
  //   foreignKey: 'conversationId',
  //   as: 'messages',
  // });

  // conversation.hasMany(message, {
  //   foreignKey: 'conversationId',
  //   as: 'unreadedMessages',
  // });

  // message.belongsTo(conversation, {
  //   foreignKey: 'conversationId',
  //   as: 'conversations',
  // });
}

module.exports = { addAssociations };
