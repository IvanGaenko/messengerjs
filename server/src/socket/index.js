import { Server } from 'socket.io';
// import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Op } from 'sequelize';

import { client } from '../redisClient';
import { corsWhitelist } from '../config/env';
import { setupWorker } from '@socket.io/sticky';
// import RedisSessionStore from '../services/sessionStore.servise';
import socketAuth from '../middleware/socketAuth';
import { updateUser } from '../services/account.service';
// import { addMessage, getUnreadMessages } from '../services/message.service';
import {
  addMessage,
  updateMessage,
  searchMessages,
  // getMessages,
} from '../services/message.service';
import { updateConversation } from '../services/conversation.service';
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

  // const client = createClient({ host: 'localhost', port: 6379 });
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
        conversations: new Set(),
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
          as: 'conversations',
          attributes: ['id', 'lastUpdated'],
          include: [
            {
              model: db.user,
              as: 'user',
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
              model: db.messageByDay,
              as: 'messageByDay',
              limit: 3,
              order: [['id', 'DESC']],
              include: [
                {
                  model: db.message,
                  as: 'messages',
                  separate: true,
                  order: [['id', 'ASC']],
                },
                {
                  required: false,
                  model: db.message,
                  as: 'unreadedMessages',
                  where: {
                    haveSeen: false,
                    userId: {
                      [Op.ne]: socket.user.id,
                    },
                  },
                },
              ],
            },
            // {
            //   model: db.message,
            //   as: 'messages',
            //   // offset: 0,
            //   // limit: 20,
            //   separate: true,
            //   order: [['id', 'ASC']],
            // },
            // {
            //   required: false,
            //   // attributes: ['content'],
            //   model: db.message,
            //   as: 'unreadedMessages',
            //   where: {
            //     haveSeen: false,
            //     userId: {
            //       [Op.ne]: socket.user.id,
            //     },
            //   },
            // },
          ],
        },
      ],
      order: [
        [
          { model: db.conversation, as: 'conversations' },
          'lastUpdated',
          'desc',
        ],
      ],
    });

    for (const friend of chatUsers.conversations) {
      users[socket.user.id].friendsId.add(friend.user[0].id);
      users[socket.user.id].conversations.add(friend.id);
    }

    const chatUsersWithUnreadMessages = chatUsers.toJSON();

    // console.log(
    //   'chatUsersWithUnreadMessages',
    //   chatUsersWithUnreadMessages.conversations[0].messageByDay
    // );

    chatUsersWithUnreadMessages.conversations =
      chatUsersWithUnreadMessages.conversations.map((chat) => {
        let unreadedMessagesCount = 0;

        console.log('chat.messageByDay.length', chat.messageByDay.length);

        if (chat.messageByDay !== undefined && chat.messageByDay.length > 0) {
          chat.messageByDay = chat.messageByDay.reverse();
          for (let y = 0; y < chat.messageByDay.length; y++) {
            const messageByDay = chat.messageByDay[y];

            if (
              messageByDay.unreadedMessages !== undefined &&
              messageByDay.unreadedMessages.length > 0
            ) {
              unreadedMessagesCount += messageByDay.unreadedMessages.length;
            }
            delete messageByDay.unreadedMessages;
          }
        }
        return {
          ...chat,
          unreadedMessagesCount,
          isTyping: false,
        };
      });

    for (const p of users[socket.user.id].clients) {
      io.to(p).emit('chatUsers', chatUsersWithUnreadMessages);
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
    console.log('date', new Date(1674319425).toLocaleTimeString());

    // const x = await getMessages(
    //   Array.from(users[socket.user.id].conversations)
    // );

    // const y = x.map((m) => m.toJSON());

    // console.log('y', y);
    console.log(
      'new Date(new Date() - 24 * 60 * 60 * 1000)',
      new Date(new Date() - 24 * 60 * 60 * 1000)
    );

    socket.on('clientResponse', async (data) => {
      console.log('data', data);
      const message = await addMessage(data);
      const conversation = await updateConversation(data.conversationId, {
        lastUpdated: new Date(),
      });

      const conversationJSON = conversation[1][0].toJSON();
      console.log('conv', conversationJSON);
      console.log('message', message);

      const pageUsers = users[socket.user.id].clients;
      for (const p of pageUsers) {
        io.to(p).emit('message', {
          message,
          lastUpdated: conversationJSON.lastUpdated,
        });
      }

      if (users[data.friendId]) {
        io.to(users[data.friendId].clients).emit('message', {
          message,
          lastUpdated: conversationJSON.lastUpdated,
        });
      }
    });

    socket.on('readReceiptResponse', async (data) => {
      console.log('message have seen', data);

      const messageIds = [];
      for (let i = 0; i < data.readReceiptIds.length; i++) {
        messageIds.push(data.readReceiptIds[i].messageId);
      }

      const messages = await updateMessage(messageIds, {
        haveSeen: true,
      });
      console.log('messages', messages);

      const pageUsers = users[socket.user.id].clients;
      for (const p of pageUsers) {
        io.to(p).emit('notify-read-rcpt', data);
      }

      if (users[data.friendId]) {
        io.to(users[data.friendId].clients).emit('notify-read-rcpt', data);
      }
    });

    socket.on('onTyping', (data) => {
      console.log('user is typing', data);
      if (users[data.friendId]) {
        io.to(users[data.friendId].clients).emit('typingResponse', data);
      }
    });

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

    socket.on('changeUserProfileData', async (data) => {
      await updateUser(socket.user.id, data);

      for (const p of users[socket.user.id].clients) {
        io.to(p).emit('update user data', data);
      }

      for (const friend of users[socket.user.id].friendsId) {
        if (users[friend]) {
          io.to(friend).emit('updateFriendData', {
            id: socket.user.id,
            ...data,
          });
        }
      }
    });

    socket.on('searchMessages', async (data) => {
      const messages = await searchMessages(
        Array.from(users[socket.user.id].conversations),
        data
      );

      for (const p of users[socket.user.id].clients) {
        io.to(p).emit('responseSearchMessages', messages);
      }
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
      // socket.emit('res', unreadedMessages);
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
