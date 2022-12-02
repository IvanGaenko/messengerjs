// // Imports
// import { io } from 'socket.io-client';

// // App Import
// import { API_URL } from '../setup/config/env';

// // Setup io
// // export const socket = io(API_URL, { autoConnect: false });
// console.log('token', localStorage.getItem('token'));
// export const socket = io(API_URL, {
//   auth: {
//     token: localStorage.getItem('token'),
//   },
//   autoConnect: false,
// });

// // Emit
// export const socketEmit = (command, data) => {
//   socket.emit(`${command}`, data);
//   console.log('Socket', command, data);
// };
