module.exports = (sequelize, DataTypes) => {
  const RefreshSession = sequelize.define('refreshSession', {
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fingerprint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresIn: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });

  return RefreshSession;
};
