import AuthService from '../services/AuthService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { salt_rows, jwtSecret, rules } from '../config/env';

// Login
export async function loginUser({ params: { email, password } }) {
  if (email && password) {
    try {
      const loggedUser = await AuthService.loginUser(email);

      if (!loggedUser) {
        return {
          success: false,
          message: 'The email you entered is invalid.',
        };
      }
      const validPassword = bcrypt.compareSync(password, loggedUser.password);
      if (!validPassword) {
        return {
          success: false,
          message: 'The password you entered is invalid.',
        };
      }

      return {
        success: true,
        data: userAuthResponse(loggedUser),
        message: 'You have been logged in successfully.',
      };
    } catch (error) {
      throw error;
    }
  }
}

export function userAuthResponse({ id, name, email }) {
  return {
    token: jwt.sign({ id: id }, jwtSecret),
    user: { name, email },
  };
}

export async function registerUser({
  params: { name, password, email, passwordRepeat },
}) {
  // Check for existing fields
  if (!name || !password || !email || !passwordRepeat) {
    return {
      success: false,
      message: 'Please enter valid data.',
    };
  }

  // Check name length
  if (name.length < rules.nameMinLength) {
    return {
      success: false,
      message: `Name needs to be atleast ${rules.nameMinLength} characters.`,
    };
  }

  // Check password length
  if (password.length < rules.passwordMinLength) {
    return {
      success: false,
      message: `Password needs to be atleast ${rules.passwordMinLength} characters.`,
    };
  }

  // Check correct passwords
  if (password !== passwordRepeat) {
    return {
      success: false,
      message: 'Passwords do not match.',
    };
  }

  try {
    // Check if user exists with same email
    const checkUser = await AuthService.findUsername(email);

    if (!checkUser) {
      const salt = bcrypt.genSaltSync(salt_rows);
      const newUser = {
        name,
        password: bcrypt.hashSync(password, salt),
        email,
      };
      try {
        const registeredUser = await AuthService.registerUser(newUser);
        return {
          success: true,
          data: userAuthResponse(registeredUser),
          message: 'You have been registered successfully.',
        };
      } catch (error) {
        return {
          success: false,
          message: 'Cant signup',
        };
      }
    } else {
      return {
        success: false,
        message: 'This email is already registered. Please login.',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Server error occurred. Please try again.',
    };
  }
}
