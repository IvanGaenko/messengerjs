// Imports
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// App Imports
import { socket as io, socketEmit } from '../setup/socket';
import { startTyping, stopTyping } from '../api/actions/typers';

// Component
const ChatRoomInput = () => {
  // State
  const { typingStatus, user } = useSelector(state => state.typers);
  const { room, connectionData } = useSelector(state => state.chat);
  const { details } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');

  // On Change
  const onChange = event => {
    setMessage(event.target.value);

    sendStartTyping({
      id: details.id,
      user: details.name,
      roomName: connectionData,
      typingStatus: true,
    });
  };

  const sendStopTyping = () => {
    return socketEmit('stop typing', {
      id: details.id,
      user: details.name,
      roomName: connectionData,
      typingStatus: false,
    });
  };

  const sendStartTyping = data => {
    socketEmit('typing', data);
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(sendStopTyping, 300);
  };

  // Send Message
  const onSend = event => {
    event.preventDefault();

    const data = {
      roomName: connectionData,
      author: details.name,
      message: message,
      messageId: room.messageId,
    };
    socketEmit('message', data);
    setMessage('');
  };

  useEffect(() => {
    io.on('typing', data => {
      if (data.id === details.id) {
        return;
      }
      if (room.chatId === data.roomName) {
        console.log('hey! its typing!', data.user);
        dispatch(startTyping(data));
      }
    });

    io.on('stop typing', data => {
      if (data.id === details.id) {
        return;
      }
      if (room.chatId === data.roomName) {
        console.log('hey! its stop typing!', data.user);
        dispatch(stopTyping(data));
      }
    });

    return () => {
      io.off('typing');
      io.off('stop typing');
    };
  });

  return (
    <div>
      <div>{typingStatus && `${user} is typing...`}</div>
      <form onSubmit={onSend}>
        {/* Input - message */}
        <input
          type="text"
          name="message"
          value={message}
          onChange={onChange}
          label="Message"
          placeholder="Type message"
          required={true}
          autoFocus
        />

        {/* Button - send */}
        <input type="submit" />
      </form>
    </div>
  );
};

export default ChatRoomInput;
