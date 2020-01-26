// Imports
import axios from 'axios';

// App Imports
import { API_URL } from '../../setup/config/env';

// Signup
export function signup({ name, email, password, passwordRepeat }) {
  return axios.post(API_URL, {
    operation: 'registerUser',
    params: { name, email, password, passwordRepeat },
  });
}
