// Imports
import socket from 'socket.io';

// App Imports
import ChatService from '../services/ChatService';

// Setup chat
export default server => {
  // Setup server
  // const server = http.createServer(app);
  // const io = require('socket.io')(server);
  const io = socket(server);

  // Setup chat connection
  io.on('connection', socket => {
    // Socket join room
    // socket.on('join', async room => {
    //   socket.join(room);
    //   io.emit('roomJoined', room);
    // });

    // // Socket message
    // socket.on('message', async data => {
    //   const { chatRoomName, author, message } = data;

    //   const chatRoom = await ChatService.getChatRoom(chatRoomName);
    //   const chatRoomId = chatRoom[0].id;

    //   const chatMessage = await ChatService.createChatRoom({
    //     chatRoomId,
    //     author,
    //     message: message,
    //   });
    //   io.emit('newMessage', chatMessage);
    // });
    console.log('Chat connected');

    socket.on('disconnect', () => {
      console.log('Chat disconnected');
    });
  });

  //   router.get('/chatrooms', async (req, res, next) => {
  //     const chatRooms = await models.ChatRoom.findAll();
  //     res.send(chatRooms);
  //   });

  //   router.post('/chatroom', async (req, res, next) => {
  //     const room = req.body.room;
  //     const chatRooms = await models.ChatRoom.findAll({
  //       where: { name: room },
  //     });
  //     const chatRoom = chatRooms[0];
  //     if (!chatRoom) {
  //       await models.ChatRoom.create({ name: room });
  //     }
  //     res.send(chatRooms);
  //   });

  //   router.get('/chatroom/messages/:chatRoomName', async (req, res, next) => {
  //     try {
  //       const chatRoomName = req.params.chatRoomName;
  //       const chatRooms = await models.ChatRoom.findAll({
  //         where: {
  //           name: chatRoomName,
  //         },
  //       });
  //       const chatRoomId = chatRooms[0].id;
  //       const messages = await models.ChatMessage.findAll({
  //         where: {
  //           chatRoomId,
  //         },
  //       });
  //       res.send(messages);
  //     } catch (error) {
  //       res.send([]);
  //     }
  //   });
};
