module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // currentChatReceiverId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  });

  return Message;
};
