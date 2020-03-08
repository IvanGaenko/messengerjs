// App Imports
import { authCheck } from '../helpers/utils';
import MessageService from '../services/MessageService';
import { getConnectionData } from './RoomController';

export async function getOldMessage(chatId) {
  if (!chatId) {
    return [];
  }
  const messages = await MessageService.getChatMessages(chatId); // Messages

  if (!messages || messages.length === 0) {
    return [
      {
        id: 1,
        author: 'Empty',
        message: 'Empty',
        isRead: true,
      },
    ];
  }
  return messages.reverse();
}

// Get Message
export async function getMessage({ auth, params: { detail, id } }) {
  if (authCheck(auth)) {
    try {
      const connectionData = await getConnectionData(detail, id);
      const messages = await MessageService.getChatMessages(
        connectionData[0].id,
      ); //Messages

      if (!messages) {
        return {
          success: false,
          message: 'There is no messages. Maybe you should write something?',
        };
      }

      return {
        success: true,
        data: messages.reverse(),
        message: 'Here is your messages',
      };
    } catch (error) {
      throw error;
    }
  }
  console.log('no authorized');
  throw new Error('You are not authorized to perform this action.');
}

export async function clearRawMessages({ auth, params: { name } }) {
  if (authCheck(auth)) {
    try {
      const updateRoom = await MessageService.updateChatMessage(name); //Messages

      if (!updateRoom) {
        return {
          success: false,
          message: 'There is no raw messages.',
        };
      }

      return {
        success: true,
        data: updateRoom,
        message: 'Success clear raw messages.',
      };
    } catch (error) {
      throw error;
    }
  }
  console.log('no authorized');
  throw new Error('You are not authorized to perform this action.');
}

export async function createMessage(data) {
  const { author, message, messageId } = data;

  const chatMessage = await MessageService.createChatMessage({
    chatRoomId: messageId,
    author,
    message,
    isRead: false,
  });

  return chatMessage;
}
