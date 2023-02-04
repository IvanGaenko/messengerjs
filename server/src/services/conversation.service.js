import db from '../models';

// eslint-disable-next-line arrow-body-style
export const updateConversation = async (id, payload) => {
  return await db.conversation.update(
    {
      ...payload,
    },
    {
      where: {
        id,
      },
      returning: true,
    }
  );
};
