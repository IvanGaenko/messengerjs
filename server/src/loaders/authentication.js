// Imports
import jwt from 'jsonwebtoken';

// App Imports
import { jwtSecret } from '../config/env';
import AuthService from '../services/AuthService';

// Authentication middleware
export default async function(req, res, next) {
  let header = req.headers.authentication;
  // console.log('authentication check!', header);

  if (header && header !== null) {
    try {
      const token = header.split(' ');
      const userToken = jwt.verify(token[1], jwtSecret);
      // console.log('userToken', userToken);

      let user = await AuthService.findUserId(userToken.id);

      if (user) {
        req.auth = {
          isAuthenticated: true,
          user,
        };
      }
      // console.log('hello', user);
    } catch (error) {
      console.warn('Invalid token detected');
    }
  } else {
    req.auth = {
      isAuthenticated: false,
      user: null,
    };
  }

  next();
}
