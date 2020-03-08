// Imports
import socketIo from 'socket.io-client';

// App Import
import { API_URL } from '../setup/config/env';

// Setup io
export const io = socketIo(API_URL).connect();

// Emit
export const socketEmit = (command, data) => {
  io.emit(`${command}`, data);
  console.log('Socket', command, data);
};
