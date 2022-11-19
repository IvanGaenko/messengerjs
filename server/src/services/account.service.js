import db from '../models';

export const findUser = async (email) => {
  return await db.user.findOne({
    where: { email },
  });
};

export const findOrCreateUser = async (payload) => {
  console.log('payload', payload);
  return await db.user.findOrCreate({
    where: { email: payload.email },
    defaults: {
      ...payload,
    },
  });
};

export const createRefreshSession = async (payload) => {
  const { userId, refreshToken, fingerprint, expiresIn } = payload;
  return await db.refreshSession.create({
    userId,
    refreshToken,
    fingerprint,
    expiresIn,
  });
};

export const removeRefreshSession = async (refreshToken) => {
  return await db.refreshSession.destroy({
    where: {
      refreshToken,
    },
  });
};

export const removeRefreshSessionById = async (userId) => {
  return await db.refreshSession.destroy({
    where: {
      userId,
    },
  });
};

export const findByPk = async (id) => {
  return await db.user.findByPk(id);
};

export const findByRefreshToken = async (refreshToken) => {
  return await db.refreshSession.findOne({
    where: { refreshToken },
  });
};

export const getCountRefreshSessions = async (userId) => {
  return await db.refreshSession.count({
    where: {
      userId,
    },
  });
};
