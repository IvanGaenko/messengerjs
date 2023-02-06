import { Op } from 'sequelize';

import db from '../models';

// export const addMessage = async (payload) =>
//   await db.message.create({
//     ...payload,
//   });

export const addMessage = async (payload) => {
  const { dayId, ...data } = payload;
  const byDay = await db.messageByDay.findOrCreate({
    where: { dayId },
    defaults: {
      dayId,
      conversationId: data.conversationId,
    },
  });
  const byDayJSON = byDay[0].toJSON();

  const message = await db.message.create({
    ...data,
    byDayId: byDayJSON.id,
  });

  const messageJSON = message.toJSON();

  return {
    ...messageJSON,
    conversationId: byDayJSON.conversationId,
    dayId,
  };
};

export const updateMessage = async (id, data) =>
  await db.message.update(
    { ...data },
    {
      where: {
        id,
      },
      returning: true,
    }
  );

export const searchMessages = async (conversations, payload) =>
  await db.message.findAll({
    where: {
      conversationId: conversations,
      content: {
        [Op.startsWith]: payload,
      },
    },

    returning: true,
  });

export const getMessages = async (conversations) =>
  await db.message.findAll({
    where: {
      conversationId: conversations,
      timestamp: {
        [Op.lt]: Math.floor(+new Date() / 1000),
        // [Op.gt]: new Date(new Date() - 5 * 24 * 60 * 60 * 1000),
      },
    },
    order: [['id', 'DESC']],
    limit: 2,
    returning: true,
  });
