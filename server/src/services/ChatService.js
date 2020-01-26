import database from '../models';

class ChatService {
  static async getChatRooms() {
    try {
      return await database.chatrooms.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async getChatRoom(name) {
    try {
      const chatRoomName = await database.chatrooms.findAll({
        where: { name: name },
      });

      return chatRoomName;
    } catch (error) {
      throw error;
    }
  }

  static async createChatRoom(id, name, message) {
    try {
      return await database.chatmessage.create({
        chatRoomId: id,
        author: name,
        message: message,
      });
    } catch (error) {
      throw error;
    }
  }
}

export default ChatService;
