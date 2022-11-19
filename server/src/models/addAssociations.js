function addAssociations(db) {
  // const { user, conversation, message, userToConversation } = sequelize.models;
  const { user, refreshSession } = db;

  user.hasMany(refreshSession, { as: 'refreshSession' });
  refreshSession.belongsTo(user, {
    foreignKey: 'userId',
    as: 'user',
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
