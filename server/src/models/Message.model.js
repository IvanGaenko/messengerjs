module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'message',
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      haveSeen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      timestamp: {
        // type: DataTypes.DATE,
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: String(+new Date()),
      },
    },
    {
      timestamps: false,
    }
  );

  return Message;
};
