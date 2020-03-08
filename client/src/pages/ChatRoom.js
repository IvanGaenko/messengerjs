// Imports
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// App Imports
import { io } from '../setup/socket';
import {
  getRoom,
  getChatRoomMessage,
  clearChatMessages,
  clearRawMessages,
  getNewChatMessages,
} from '../api/actions/chat';
import routes from '../setup/routes';
import ChatRoomInput from './ChatRoomInput';
import ChatRoomList from './ChatRoomList';

function ChatRoom() {
  // State
  const { id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [clear, setClear] = useState(false);

  const { rooms, room, messages } = useSelector(state => state.chat);
  const { details } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // Connect To Room
  const connectToRoom = async () => {
    await getCurrentRoom();
    await getMessage();
    // clearRaw();
  };

  // get Current Room
  const getCurrentRoom = async () => {
    console.log('getCurrentRoom');

    if (messages.length !== 0) {
      dispatch(clearChatMessages());
    }

    // if (rawMessages.length !== 0) {
    //   dispatch(clearRawMessages(details.id, id));
    // }

    dispatch(getRoom(details.id, id, rooms));
    setInitialized(true);
  };

  // Get Message
  const getMessage = async () => {
    dispatch(getChatRoomMessage(details.id, id, rooms));
    setInitialized(true);
  };

  // Get New Message
  const getNewMessages = async data => {
    dispatch(getNewChatMessages(data));
  };

  // Clear Readed Messages
  const clearRaw = async () => {
    console.log('start clearRaw');
    dispatch(clearRawMessages(details.id, id, details.name));
    setClear(true);
  };

  useEffect(() => {
    if (!initialized) {
      connectToRoom();
      // clearRaw();
    }

    if (!clear) {
      clearRaw();
    }

    io.on('newMessage', async data => {
      console.log('hey! new messages!');
      await getNewMessages(data);
      setClear(false);
    });

    return () => {
      io.off('newMessage');
    };
  });

  return (
    <div>
      <Link to={routes.chat.path}>Back</Link>
      <div>{room.name}</div>

      <ChatRoomList />
      <ChatRoomInput />
    </div>
  );
}

export default ChatRoom;
