import { authCheck } from '../helpers/utils';
import UserService from '../services/UserService';
import { getConnectionData } from './room.controller';
import { getOldMessage } from './message.controller';

export const profileController = async (req, res) => {
  const { id, username, email } = req.body.user;
  return res.status(200).json({
    success: true,
    message: 'Setup Current User',
    data: {
      id,
      username,
      email,
    },
  });
};

export async function getAllChatRooms({
  auth,
  params: { detail, friendList, limit },
}) {
  console.log('LIST LIMIT', limit);

  if (authCheck(auth)) {
    if (!detail || !Number.isInteger(detail)) {
      return {
        success: false,
        message: 'There is wrong detail.id',
      };
    }

    // Get Chat Rooms
    const getAllRooms = await UserService.getChatRooms(friendList); //Users

    if (!getAllRooms) {
      return {
        success: false,
        message: 'There is no chatrooms. Maybe you should create one?',
      };
    }

    const chatList = getAllRooms.map((rooms) => {
      return {
        name: rooms.name,
        id: rooms.id,
        email: rooms.email,
        friendList: rooms.friendList,
      };
    });

    for (const item of chatList) {
      const connectionData = await getConnectionData(detail, item.id); //Room
      const getMessageData = await getOldMessage(connectionData[0].id, limit); // Messages
      item.chatId = connectionData[0].name;
      item.messageId = connectionData[0].id;
      item.rawMessages = getMessageData.filter((item) => item.isRead !== true);
      item.oldMessages = getMessageData;
    }

    return {
      success: true,
      data: chatList,
      message: 'Here is your chatrooms list',
    };
  }
  console.log('no authorized');
  throw new Error('You are not authorized to perform this action.');
}

// Get Room
export async function getRoom({ auth, params: { detail, id, limit } }) {
  console.log('ROOM LIMIT', limit);
  if (authCheck(auth)) {
    const getCurrentRoom = await UserService.getChatRoom(id); //Users
    const connectionData = await getConnectionData(detail, id); // Room

    if (!getCurrentRoom) {
      return {
        success: false,
        message: 'There is no chatroom. Maybe you should create one?',
      };
    }

    const currentRoom = [getCurrentRoom].map((c) => {
      return {
        id: c.id,
        email: c.email,
        name: c.name,
        chatId: connectionData[0].name,
        messageId: connectionData[0].id,
      };
    });

    for (const item of currentRoom) {
      const getMessageData = await getOldMessage(connectionData[0].id, limit); //Messages
      item.rawMessages = getMessageData.filter((item) => item.isRead !== true);
    }

    return {
      success: true,
      data: currentRoom,
      message: 'Here is your chatroom',
    };
  }
  console.log('no authorized');
  throw new Error('You are not authorized to perform this action.');
}
