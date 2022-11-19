// Imports
import jwt from 'jsonwebtoken';

// App Imports
import { jwtSecret } from '../config/env';
import AuthService from '../services/AuthService';

// Authentication middleware
export default async function (socket, next) {
  const socketToken = socket.handshake.auth
    ? socket.handshake.auth.token
    : null;

  if (!socketToken) {
    try {
      const token = socketToken.split(' ');
      const userToken = jwt.verify(token[1], jwtSecret);
      console.log('userToken', userToken);

      if (!userToken.id) {
        return next(new Error('Bad request'));
      }

      let user = await AuthService.findUserId(userToken.id);

      if (!user) return next(new Error('Not authorized!'));
      socket.user = user;
      next();
    } catch {
      return next(new Error('authentication failed!'));
    }
  }
}
