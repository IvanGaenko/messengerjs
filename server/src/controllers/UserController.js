// App Imports
import { authCheck } from '../helpers/utils';
import UserService from '../services/UserService';
import { getConnectionData } from './RoomController';
import { getOldMessage } from './MessageController';

// Get All ChatRooms - Users
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

    try {
      // Get Chat Rooms
      const getAllRooms = await UserService.getChatRooms(friendList); //Users

      if (!getAllRooms) {
        return {
          success: false,
          message: 'There is no chatrooms. Maybe you should create one?',
        };
      }

      const chatList = getAllRooms.map(rooms => {
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
        item.rawMessages = getMessageData.filter(item => item.isRead !== true);
        item.oldMessages = getMessageData;
      }

      return {
        success: true,
        data: chatList,
        message: 'Here is your chatrooms list',
      };
    } catch (error) {
      throw error;
    }
  }
  console.log('no authorized');
  throw new Error('You are not authorized to perform this action.');
}

// Get Room
export async function getRoom({ auth, params: { detail, id, limit } }) {
  console.log('ROOM LIMIT', limit);
  if (authCheck(auth)) {
    try {
      const getCurrentRoom = await UserService.getChatRoom(id); //Users
      const connectionData = await getConnectionData(detail, id); // Room

      if (!getCurrentRoom) {
        return {
          success: false,
          message: 'There is no chatroom. Maybe you should create one?',
        };
      }

      const currentRoom = [getCurrentRoom].map(c => {
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
        item.rawMessages = getMessageData.filter(item => item.isRead !== true);
      }

      return {
        success: true,
        data: currentRoom,
        message: 'Here is your chatroom',
      };
    } catch (error) {
      throw error;
    }
  }
  console.log('no authorized');
  throw new Error('You are not authorized to perform this action.');
}

// Add Friend
export async function addFriend({
  params: { userId, searchId, newFriendList },
}) {
  if (!searchId || !newFriendList) {
    return {
      success: false,
      message: 'There is wrong user id',
    };
  }

  const checkUserId = await UserService.getUser(parseInt(searchId));
  console.log('checkUserId', checkUserId);
  if (!checkUserId) {
    return {
      success: false,
      message: 'There is no user',
    };
  }

  try {
    const getAllFriends = await UserService.addFriend(userId, newFriendList);
    console.log('getAllFriends', getAllFriends);

    if (!getAllFriends) {
      return {
        success: false,
        message: 'There is no friends list.',
      };
    }

    return {
      success: true,
      data: getAllFriends,
      message: 'Here is your friends list',
    };
  } catch (error) {
    throw error;
  }
}
