module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define(
    'conversation',
    {
      // users: {
      //   type: DataTypes.STRING,
      //   unique: true,
      // },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    },
    {
      timestamps: false,
    }
  );

  return Conversation;
};
