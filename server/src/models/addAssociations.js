function addAssociations(db) {
  const { user, refreshSession, conversation, userToConversation, message } =
    db;
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

  // conversation - messages
  conversation.hasMany(message, {
    foreignKey: 'conversationId',
    as: 'messages',
  });

  conversation.hasMany(message, {
    foreignKey: 'conversationId',
    as: 'unreadedMessages',
  });

  message.belongsTo(conversation, {
    foreignKey: 'conversationId',
    as: 'conversations',
  });
}

module.exports = { addAssociations };

// user.hasMany(userToConversation);
// userToConversation.belongsTo(user);

// conversation.hasMany(userToConversation);
// userToConversation.belongsTo(conversation);

// conversation.hasMany(message);
// message.belongsTo(conversation);

// user.hasMany(message);
// message.belongsTo(user);
