module.exports = (sequelize, DataTypes) => {
  const MessageByDay = sequelize.define(
    'messageByDay',
    {
      // content: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      // haveSeen: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: false,
      //   defaultValue: true,
      // },
      dayId: {
        // type: DataTypes.DATE,
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        defaultValue: Math.floor(+new Date() / 100000),
      },
    },
    {
      timestamps: false,
    }
  );

  return MessageByDay;
};
