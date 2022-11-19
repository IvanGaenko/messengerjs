// Imports
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// App Imports
import { jwtSecret } from '../config/env';
import AuthService from '../services/AuthService';

// Authentication middleware
export default async function (req, res, next) {
  // let header = req.headers.authentication;
  let { authentication, rt } = req.headers;
  console.log('authentication check!', header);

  if (!authentication && !rt) {
    req.auth = {
      isAuthenticated: false,
      user: null,
    };
    return next();
  }

  const token = authentication.split(' ');

  if (token.length !== 3 && token[0] !== 'Bearer') {
    req.auth = {
      isAuthenticated: false,
      user: null,
    };
    return next();
  }

  try {
    const userToken = jwt.verify(token[1], jwtSecret);
    const validUser = bcrypt.compareSync(String(userToken.id), token[2]);
    console.log('validUser', validUser);

    if (!validUser) {
      req.auth = {
        isAuthenticated: false,
        user: null,
      };
      return next();
    }

    req.auth = {
      isAuthenticated: true,
      user,
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
    }
  }

  next();

  // if (header && header !== null) {
  //   try {
  //     const token = header.split(' ');
  //     const userToken = jwt.verify(token[1], jwtSecret);
  console.log('userToken', userToken);

  //     if (!userToken.id) {
  //       return next();
  //     }

  //     let user = await AuthService.findUserId(userToken.id);

  //     if (user) {
  //       req.auth = {
  //         isAuthenticated: true,
  //         user,
  //       };
  //     }
  //     // console.log('hello', user);
  //   } catch (error) {
  //     // name - TokenExpiredError
  //     // message - jwt expired
  //     console.warn('Invalid token detected');
  //   }
  // } else {
  //   req.auth = {
  //     isAuthenticated: false,
  //     user: null,
  //   };
  // }

  // next();
}
