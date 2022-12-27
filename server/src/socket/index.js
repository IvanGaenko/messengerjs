import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Op } from 'sequelize';

import { corsWhitelist } from '../config/env';
import { setupWorker } from '@socket.io/sticky';
import socketAuth from '../middleware/socketAuth';
import { updateUser } from '../services/account.service';
import db from '../models';

export default async (server) => {
  console.log('SETUP - Socket..');

  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // console.log('socket origin', origin);
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

    if (!users[socket.user.id]) {
      users[socket.user.id] = {
        friendsId: new Set(),
        clients: [],
        isOnline: false,
        reloadPageTimeout: null,
      };
    }

    console.log('users before init', users);

    if (users[socket.user.id].reloadPageTimeout !== null) {
      clearTimeout(users[socket.user.id].reloadPageTimeout);
      users[socket.user.id].reloadPageTimeout = null;
    }

    users[socket.user.id].clients.push(socket.id);

    const chatUsers = await db.user.findByPk(socket.user.id, {
      attributes: ['id', 'username', 'email', 'isOnline', 'lastActivity'],
      include: [
        {
          model: db.conversation,
          attributes: ['id', 'name'],
          include: [
            {
              model: db.user,
              where: {
                id: {
                  [Op.ne]: socket.user.id,
                },
              },
              attributes: [
                'id',
                'username',
                'email',
                'isOnline',
                'lastActivity',
              ],
            },
            {
              model: db.message,
              as: 'messages',
            },
          ],
        },
      ],
      order: [
        [db.conversation, { model: db.message, as: 'messages' }, 'id', 'asc'],
      ],
    });

    for (const friend of chatUsers.conversations) {
      users[socket.user.id].friendsId.add(friend.users[0].id);
    }

    for (const p of users[socket.user.id].clients) {
      io.to(p).emit('chatUsers', chatUsers);
    }

    if (!users[socket.user.id].isOnline) {
      await updateUser(socket.user.id, {
        isOnline: true,
      });

      for (const friend of users[socket.user.id].friendsId) {
        if (users[friend]) {
          io.to(friend).emit('friend online status', {
            id: socket.user.id,
            online: true,
          });
        }
      }

      users[socket.user.id].isOnline = true;
    }

    console.log('users after init', users);

    socket.on('onRefreshActivity', async () => {
      const pageUsers = users[socket.user.id].clients;
      for (const p of pageUsers) {
        if (p !== socket.id) {
          io.to(p).emit('doRefreshActivity', '');
        }
      }

      if (!users[socket.user.id].isOnline) {
        for (const p of pageUsers) {
          io.to(p).emit('update user data', { isOnline: true });
        }

        await updateUser(socket.user.id, {
          isOnline: true,
        });

        for (const friend of users[socket.user.id].friendsId) {
          if (users[friend]) {
            io.to(friend).emit('friend online status', {
              id: socket.user.id,
              online: true,
            });
          }
        }

        users[socket.user.id].isOnline = true;
        console.log('users after refresh activity', users);
      }
    });

    socket.on('setAdminOffline', async () => {
      const lastActivity = new Date().toISOString();

      await updateUser(socket.user.id, {
        isOnline: false,
        lastActivity,
      });

      for (const p of users[socket.user.id].clients) {
        io.to(p).emit('update user data', { isOnline: false });
      }

      for (const friend of users[socket.user.id].friendsId) {
        if (users[friend]) {
          io.to(friend).emit('friend online status', {
            id: socket.user.id,
            online: false,
            lastActivity,
          });
        }
      }

      users[socket.user.id].isOnline = false;
      console.log('users after admin offline', users);
    });

    socket.on('disconnect', async () => {
      console.log('🔥: Chat disconnected', socket.id);

      users[socket.user.id].clients = users[socket.user.id].clients.filter(
        (user) => user !== socket.id
      );

      if (users[socket.user.id].clients.length === 0) {
        const lastActivity = new Date().toISOString();
        users[socket.user.id].reloadPageTimeout = setTimeout(async () => {
          await updateUser(socket.user.id, {
            isOnline: false,
            lastActivity,
          });

          for (const friend of users[socket.user.id].friendsId) {
            if (users[friend]) {
              io.to(friend).emit('friend online status', {
                id: socket.user.id,
                online: false,
                lastActivity,
              });
            }
          }

          clearTimeout(users[socket.user.id].reloadPageTimeout);
          delete users[socket.user.id];
          console.log(`User${socket.user.id} successfully disconnected.`);
          console.log('users after logout', users);
        }, 5 * 1000);
      }

      console.log('users after disconnect', users);
    });

    socket.on('logout', () => {
      // remote logout from all instances
      const pageUsers = users[socket.user.id].clients;
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
