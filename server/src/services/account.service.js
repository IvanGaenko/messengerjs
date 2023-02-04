import db from '../models';

export const findUser = async (email) =>
  await db.user.findOne({
    where: { email },
  });

export const findOrCreateUser = async (payload) =>
  await db.user.findOrCreate({
    where: { email: payload.email },
    defaults: {
      ...payload,
    },
  });

export const updateUser = async (id, payload) =>
  await db.user.update(
    {
      ...payload,
    },
    {
      where: {
        id,
      },
    }
  );

export const findByPk = async (id) => await db.user.findByPk(id);
