import { io } from 'socket.io-client';

const API_URL = 'http://localhost:3002';

// const state = store.getState();
// console.log('state', state);
// export const socket = io(API_URL, {
//   auth: {
//     token: '',
//   },
//   autoConnect: false,
// });

// socket.on('connect', (socket) => {
//   console.log('connected to server');

//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

// socket.onAny((event, ...args) => {
//   console.log(event, args);
// });

class Socket {
  constructor(io, url) {
    this.io = io;
    this.url = url;
    this.socket = this.io(this.url, {
      auth: {
        token: '',
      },
      autoConnect: false,
    });
  }
}

const socketIo = new Socket(io, API_URL);

export const { socket } = socketIo;

export default socketIo;
