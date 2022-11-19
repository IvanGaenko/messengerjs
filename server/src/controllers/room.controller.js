// App Imports
import RoomService from '../services/RoomService';

// Connection Data - Room
export async function getConnectionData(detail, id) {
  if (detail === parseInt(id)) {
    return [
      {
        id: 0,
        name: 'Empty',
      },
    ];
  }

  const chatId = `${detail}:${id}`;
  const reverseChatId = `${id}:${detail}`;

  const findRoomOne = await RoomService.getChatRoomId(chatId);
  if (findRoomOne.length === 0) {
    const findRoomTwo = await RoomService.getChatRoomId(reverseChatId);
    if (findRoomTwo.length === 0) {
      const createRoom = await RoomService.createChatRoom(chatId);
      return createRoom;
    }
    return findRoomTwo;
  }
  return findRoomOne;
}
