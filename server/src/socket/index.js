import { Server } from 'socket.io';

import { CORS_whitelist as CORSWhitelist } from '../config/env';
import socketAuth from '../middleware/socketAuth';

export default (server) => {
  console.log('SETUP - Socket..');
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        console.log('socket origin', origin);
        if (!origin) return callback(null, true);
        if (CORSWhitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    },
  });

  io.use(socketAuth);

  const onConnection = (socket) => {
    console.log('⚡:Chat connected. Socket', socket.id);
    console.log('Socket user', socket.user);

    socket.on('click', (data) => {
      console.log('click', data);
    });

    socket.on('disconnect', () => {
      console.log('🔥: Chat disconnected', socket.id);
    });
  };

  io.on('connection', onConnection);
};

//   console.log('socket.handshake.auth', socket.handshake.auth);
//   // Join or Create ChatRoom
//   socket.on('join', async (joined) => {
//     socket.join(joined);
//     console.log('You join to the channel', joined);
//   });

//   // Receive messages
//   socket.on('message', async (data) => {
//     console.log('message', data);
//     const chatMessage = await createMessage(data);
//     io.sockets.in(data.roomName).emit('newMessage', chatMessage);
//     io.sockets.emit('unread', chatMessage);
//   });

//   socket.on('checkMessage', async (data) => {
//     console.log('checkMessage', data);
//     io.sockets.in(data.roomName).emit('updateMessage', data);
//   });

//   socket.on('typing', async (data) => {
//     console.log('data', data);
//     io.sockets.in(data.roomName).emit('typing', data);
//   });

//   socket.on('stop typing', async (data) => {
//     console.log('data', data);
//     io.sockets.in(data.roomName).emit('stop typing', data);
//   });
