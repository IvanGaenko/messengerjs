import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
// import { Op } from 'sequelize';

import { corsWhitelist } from '../config/env';
import { setupWorker } from '@socket.io/sticky';
import socketAuth from '../middleware/socketAuth';
// import { updateUser } from '../services/account.service';
// import db from '../models';

export default async (server) => {
  console.log('SETUP - Socket..');

  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        console.log('socket origin', origin);
        if (!origin) return callback(null, true);
        if (corsWhitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    },
  });

  const client = createClient({ host: 'localhost', port: 6379 });
  const subscriber = client.duplicate();

  client.on('error', (err) => console.log('Redis Client Error', err));
  subscriber.on('error', (err) => console.log('Redis Subscriber Error', err));

  await client.connect();
  await subscriber.connect();

  io.adapter(createAdapter(client, subscriber));

  setupWorker(io);

  io.use(socketAuth);

  const users = {};

  const onConnection = async (socket) => {
    console.log('⚡: Chat connected. Socket', socket.id);
    socket.join(socket.user.id);

    if (!users[socket.user.id]) users[socket.user.id] = [];
    users[socket.user.id].push(socket.id);

    socket.on('disconnect', async () => {
      console.log('🔥: Chat disconnected', socket.id);

      users[socket.user.id] = users[socket.user.id].filter(
        (user) => user !== socket.id,
      );
      if (users[socket.user.id].length === 0) {
        delete users[socket.user.id];
      }
    });

    socket.on('logout', () => {
      const pageUsers = users[socket.user.id];
      for (const p of pageUsers) {
        if (p !== socket.id) {
          io.to(p).emit('doLogout', '');
        }
      }
    });

    // -----------------

    socket.on('click', async (data) => {
      const sockets = await io.in(socket.user.id).fetchSockets();
      console.log('sockets', sockets.length);

      // const myId = 1;
      // const user = await db.user.findByPk(socket.user.id, {
      //   // include: { all: true, nested: true },
      //   attributes: ['id', 'username', 'email'],
      //   include: {
      //     model: db.conversation,
      //     attributes: ['id', 'name'],
      //     include: [
      //       {
      //         model: db.user,
      //         where: {
      //           id: {
      //             [Op.ne]: socket.user.id,
      //           },
      //         },
      //         // include: 'messages',
      //         attributes: ['id', 'username', 'email'],
      //       },
      //       {
      //         model: db.message,
      //         as: 'messages',
      //       },
      //     ],
      //   },
      // });

      // console.log('user with history', JSON.stringify(user, null, 2));
      console.log('click', data);
      socket.emit('res', data);
    });
  };

  io.on('connection', onConnection);

  // io.of('/').adapter.on('error', function (error) {
  //   console.log('error: ', error);
  // });
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
