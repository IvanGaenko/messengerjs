// Imports
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// App Imports
import { getChatRooms } from '../api/actions/chat';
import { io } from '../setup/socket';
import FriendMessagePanel from './FriendMessagePanel';

// Component
const Chat = () => {
  // state
  const [initialized, setInitialized] = useState(false);
  const { rooms } = useSelector(state => state.chat);
  const { details } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  // get Rooms
  const getRooms = async () => {
    console.log('getRooms');
    dispatch(getChatRooms(details.id, details.friendList));
    setInitialized(true);
  };

  useEffect(() => {
    if (!initialized) {
      getRooms();
    }

    io.on('unread', async () => {
      console.log('hey! new messages!');
      await getRooms();
    });
    return () => {
      io.off('unread');
    };
  });

  return (
    <div style={{ textAlign: 'center', margin: '30vh auto', width: '70%' }}>
      <p>Chat</p>

      <div>
        <p>Sunt consiliumes convertam nobilis, neuter cobaltumes.</p>
        <FriendMessagePanel rooms={rooms} />
      </div>
    </div>
  );
};

export default Chat;
