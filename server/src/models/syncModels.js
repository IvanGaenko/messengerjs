const syncModels = async (db) => {
  const {
    user,
    refreshSession,
    conversation,
    userToConversation,
    message,
    messageByDay,
  } = db;

  try {
    await user.sync();
    await refreshSession.sync();
    await conversation.sync();
    await userToConversation.sync();

    await messageByDay.sync({ force: true });
    await message.sync({ force: true });

    // await messageByDay.sync();
    // await message.sync();

    console.log(
      `Models ${user.name}, ${refreshSession.name} have been synced.`
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = { syncModels };
