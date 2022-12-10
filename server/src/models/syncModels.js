const syncModels = async (db) => {
  const { user, refreshSession, conversation, userToConversation, message } =
    db;

  try {
    await user.sync();
    await refreshSession.sync();
    // await User.sync({ force: true });
    await conversation.sync();
    await userToConversation.sync();
    await message.sync();
    console.log(
      `Models ${user.name}, ${refreshSession.name} have been synced.`,
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = { syncModels };
