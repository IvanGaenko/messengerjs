// App Imports
import database from '../models';

class RoomService {
  // Rooms
  static async getChatRoomId(id) {
    try {
      console.log('getChatRoomId', id);
      const chatRoomId = await database.Rooms.findAll({
        where: { name: id },
      });

      return chatRoomId;
    } catch (error) {
      throw error;
    }
  }

  // Rooms
  static async createChatRoom(id) {
    console.log('createChatRoom');
    const newRoom = {
      name: id,
    };
    try {
      return await database.Rooms.create(newRoom);
    } catch (error) {
      throw error;
    }
  }
}

export default RoomService;
