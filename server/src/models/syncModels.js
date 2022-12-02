// const syncModels = async (sequelize) => {
const syncModels = async (db) => {
  // const { User, Conversation, Message, UserToConversation } = sequelize.models;
  // const { User } = sequelize.models;
  const { user, refreshSession } = db;

  try {
    await user.sync();
    await refreshSession.sync();
    // await User.sync({ force: true });
    // await Conversation.sync();
    // await UserToConversation.sync();
    // await Message.sync();
    console.log(
      `Models ${user.name}, ${refreshSession.name} have been synced successfully.`,
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = { syncModels };
