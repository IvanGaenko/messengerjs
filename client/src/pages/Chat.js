// Imports
import React, { useEffect } from 'react';
import io from 'socket.io-client';
// import { useSelector } from 'react-redux';

// App Imports
import { API_URL } from '../setup/config/env';

// Component
const Chat = () => {
  // state
  // const { details } = useSelector(state => state.auth);

  const socket = io(API_URL);

  const connectToRoom = () => {
    socket.on('connection', data => {
      console.log('client connected');
      data.on('disconnect', () => {
        console.log('client disconnected');
      });
    });
  };

  useEffect(() => {
    connectToRoom();
  });

  return (
    <div>
      <p>Chat</p>

      <div>
        <p>Sunt consiliumes convertam nobilis, neuter cobaltumes.</p>

        <form>
          {/* Input - message */}
          <input
            type="text"
            name="message"
            // value={user.email}
            // onChange={onChange}
            label="Message"
            placeholder="Type message"
            required={true}
            autoFocus
          />

          {/* Button - send */}
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Chat;
