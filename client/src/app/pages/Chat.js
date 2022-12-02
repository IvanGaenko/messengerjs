import React from 'react';
import { socket } from '../socket';

const Chat = () => {
  const click = () => {
    console.log('socket', socket);
    socket.emit('click', 'hello');
    console.log('clicked');
    // window.history.pushState({}, '', '/login');
  };
  return (
    <>
      <p>Chat</p>
      <button onClick={click}>Click</button>
    </>
  );
};

export default Chat;
