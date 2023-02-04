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
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: Math.floor(+new Date() / 1000),
      },
    },
    {
      timestamps: false,
    }
  );

  return Message;
};
