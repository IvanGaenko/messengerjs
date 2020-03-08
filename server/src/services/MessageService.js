// App Imports
import database, { Sequelize } from '../models';
const Op = Sequelize.Op;

class MessageService {
  static async createChatMessage(newMessage) {
    console.log('createChatMessage');
    try {
      return await database.Messages.create(newMessage);
    } catch (error) {
      throw error;
    }
  }

  static async getChatMessages(id) {
    console.log('getChatMessages', id);
    try {
      const chatMessages = await database.Messages.findAll({
        where: { chatRoomId: id },
        limit: 5,
        order: [['id', 'DESC']],
      });

      return chatMessages;
    } catch (error) {
      throw error;
    }
  }

  static async updateChatMessage(name) {
    try {
      await database.Messages.update(
        {
          isRead: true,
        },
        {
          where: {
            author: {
              [Op.ne]: name,
            },
          },
        },
      );

      const updateMessage = await database.Messages.findAll({
        where: { isRead: false },
      });

      return updateMessage;
    } catch (error) {
      throw error;
    }
  }

  static async editMessage(messageId, author, message) {
    try {
      const messageToEdit = await database.Messages.findOne({
        where: { id: Number(messageId) },
      });
      if (messageToEdit && messageToEdit.author === author) {
        await database.Messages.update(
          { message },
          {
            where: {
              id: Number(messageId),
            },
          },
        );
        return { messageId, author, message };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async deleteMessage(messageId, author) {
    try {
      const messageToDelete = await database.Messages.findOne({
        where: { id: Number(messageId) },
      });
      if (messageToDelete && messageToDelete.author === author) {
        await database.Messages.destroy({
          where: { id: Number(messageId) },
        });
        return { messageId, author };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default MessageService;
