import db from '../models';

export const createRefreshSession = async (payload) =>
  await db.refreshSession.create({
    ...payload,
  });

export const removeRefreshSession = async (refreshToken) =>
  await db.refreshSession.destroy({
    where: {
      refreshToken,
    },
  });

export const removeRefreshSessionById = async (userId) =>
  await db.refreshSession.destroy({
    where: {
      userId,
    },
  });

export const findByRefreshToken = async (refreshToken) =>
  await db.refreshSession.findOne({
    where: { refreshToken },
  });

export const getCountRefreshSessions = async (userId) =>
  await db.refreshSession.count({
    where: {
      userId,
    },
  });
