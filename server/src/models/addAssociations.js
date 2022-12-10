function addAssociations(db) {
  const { user, refreshSession, conversation, userToConversation, message } =
    db;

  user.hasMany(refreshSession, { as: 'refreshSession' });
  refreshSession.belongsTo(user, {
    foreignKey: 'userId',
    as: 'user',
  });

  // user.belongsToMany(conversation, {
  //   through: userToConversation,
  //   as: 'users',
  //   foreignKey: 'userId',
  // });

  // conversation.belongsToMany(user, {
  //   through: userToConversation,
  //   as: 'conversations',
  //   foreignKey: 'conversationId',
  // });

  user.belongsToMany(conversation, { through: userToConversation });
  conversation.belongsToMany(user, { through: userToConversation });

  user.hasMany(message, {
    as: 'messages',
  });
  message.belongsTo(user, {
    foreignKey: 'userId',
    as: 'user',
  });

  conversation.hasMany(message, {
    as: 'messages',
  });
  message.belongsTo(conversation, {
    foreignKey: 'conversationId',
    as: 'conversation',
  });

  // user.hasMany(userToConversation);
  // userToConversation.belongsTo(user);

  // conversation.hasMany(userToConversation);
  // userToConversation.belongsTo(conversation);

  // conversation.hasMany(message);
  // message.belongsTo(conversation);

  // user.hasMany(message);
  // message.belongsTo(user);
}

module.exports = { addAssociations };
