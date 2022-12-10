module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('conversation', {
    // users: {
    //   type: DataTypes.STRING,
    //   unique: true,
    // },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Conversation;
};
