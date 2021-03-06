// App Imports
import { authCheck } from '../helpers/utils';
import MessageService from '../services/MessageService';
import { getConnectionData } from './RoomController';

export async function getOldMessage(chatId, limit) {
  if (!chatId) {
    return [];
  }
  const messages = await MessageService.getChatMessages(chatId, limit); // Messages

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
export async function getMessage({ auth, params: { detail, id, limit } }) {
  if (authCheck(auth)) {
    try {
      const connectionData = await getConnectionData(detail, id);
      const messages = await MessageService.getChatMessages(
        connectionData[0].id,
        limit,
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

export async function clearRawMessages({ auth, params: { detail, id, name } }) {
  if (authCheck(auth)) {
    try {
      const connectionData = await getConnectionData(detail, id); // Room
      const updateRoom = await MessageService.updateChatMessage(
        name,
        connectionData[0].id,
      ); //Messages

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

export async function editChatMessage({
  auth,
  params: { messageId, author, message },
}) {
  if (authCheck(auth)) {
    try {
      const editChatRoom = await MessageService.editMessage(
        messageId,
        author,
        message,
      ); //Messages

      if (!editChatRoom) {
        return {
          success: false,
          message: 'There is no message to edit.',
        };
      }

      return {
        success: true,
        data: editChatRoom,
        message: 'Success edit message.',
      };
    } catch (error) {
      throw error;
    }
  }
  console.log('no authorized');
  throw new Error('You are not authorized to perform this action.');
}

export async function deleteChatMessage({
  auth,
  params: { messageId, author },
}) {
  if (authCheck(auth)) {
    try {
      const deleteChatRoom = await MessageService.deleteMessage(
        messageId,
        author,
      ); //Messages

      if (!deleteChatRoom) {
        return {
          success: false,
          message: 'There is no message to delete.',
        };
      }

      return {
        success: true,
        data: deleteChatRoom,
        message: 'Success delete message.',
      };
    } catch (error) {
      throw error;
    }
  }
  console.log('no authorized');
  throw new Error('You are not authorized to perform this action.');
}
