// Imports
import socket from 'socket.io';

// App Imports
import { createMessage } from '../controllers/MessageController';

// Setup chat
export default server => {
  // Setup server
  const io = socket.listen(server);

  // Setup chat connection
  io.on('connection', socket => {
    console.log('Chat connected. Socket', socket.id);

    // Join or Create ChatRoom
    socket.on('join', async joined => {
      try {
        socket.join(joined);
        console.log('You join to the channel', joined);
      } catch (error) {
        throw error;
      }
    });

    // Receive messages
    socket.on('message', async data => {
      console.log('message', data);
      const chatMessage = await createMessage(data);
      io.sockets.in(data.roomName).emit('newMessage', chatMessage);
      io.sockets.emit('unread', chatMessage);
    });

    socket.on('checkMessage', async data => {
      console.log('checkMessage', data);
      io.sockets.in(data.roomName).emit('updateMessage', data);
    });

    socket.on('typing', async data => {
      console.log('data', data);
      io.sockets.in(data.roomName).emit('typing', data);
    });

    socket.on('stop typing', async data => {
      console.log('data', data);
      io.sockets.in(data.roomName).emit('stop typing', data);
    });

    socket.on('disconnect', () => {
      console.log('Chat disconnected', socket.id);
    });
  });
};
