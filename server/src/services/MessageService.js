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

  static async editMessage() {}
}

export default MessageService;
