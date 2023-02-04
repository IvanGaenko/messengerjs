import { Op } from 'sequelize';

import db from '../models';

export const addMessage = async (payload) =>
  await db.message.create({
    ...payload,
  });

export const updateMessage = async (payload, data) =>
  await db.message.update(
    // {
    //   haveSeen: true,
    // },
    { ...data },
    {
      where: {
        id: payload,
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
