import ChatService from '../services/ChatService';

// Get All ChatRooms
export async function getAllChatRooms() {
  try {
    const getAllRooms = await ChatService.getChatRooms();

    if (!getAllRooms) {
      return {
        success: false,
        message: 'There is no chatrooms. Maybe you should create one?',
      };
    }

    return {
      success: true,
      data: getAllRooms,
      message: 'Here is your chatrooms list',
    };
  } catch (error) {
    throw error;
  }
}

// Create Chat Room
export async function createChatRoom({ params: { username } }) {}
