// Imports
import axios from 'axios';

// App Imports
import { API_URL } from '../../setup/config/env';
import {
  LOGIN_REQUEST,
  LOGIN_RESPONSE,
  SET_USER,
  LOGOUT,
  // ADD_FRIEND,
} from '../types/authTypes';

// Actions

// Login a user using credentials
export function login({ email, password }, isLoading = true) {
  return async dispatch => {
    dispatch({
      type: LOGIN_REQUEST,
      isLoading,
    });

    try {
      // const { data } = await axios.post(API_URL, {
      const hello = await axios.post(API_URL, {
        operation: 'loginUser',
        params: { email, password },
      });
      const { data } = hello;
      console.log('hello', hello);
      let error = data.message;
      if (data.success) {
        dispatch(setUser(data.data.token, data.data.rt, data.data.user));

        setUserLocally(data.data.token, data.data.rt, data.data.user);
      } else {
        dispatch({
          type: LOGIN_RESPONSE,
          error,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

// Set user after login or using local (AsyncStorage) token
export function setUser(token, rt, user) {
  console.log('user', user);
  if (token && rt) {
    axios.defaults.headers.common['Authentication'] = `Bearer ${token}`;
    axios.defaults.headers.common['RT'] = `Bearer ${rt}`;
  } else {
    delete axios.defaults.headers.common['Authentication'];
    delete axios.defaults.headers.common['RT'];
  }

  return {
    type: SET_USER,
    user,
  };
}

// Log out user and remove token from local (AsyncStorage)
export function logout() {
  return dispatch => {
    unsetUserLocally();

    dispatch({
      type: LOGOUT,
    });
  };
}

// Set user token and info locally (AsyncStorage)
export function setUserLocally(token, rt, user) {
  // export function setUserLocally(user) {
  // Set token
  window.localStorage.setItem('token', token);
  window.localStorage.setItem('rt', rt);
  window.localStorage.setItem('user', JSON.stringify(user));
}

// Unset user token and info locally (AsyncStorage)
export function unsetUserLocally() {
  // Remove token
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');

  // Remove cached data
  for (let item of Object.keys({ ...window.localStorage })) {
    if (item.indexOf('CACHE.KEY.') !== -1) {
      window.localStorage.removeItem(item);
    }
  }
}

// Signup
export function signup({ username, email, password, passwordRepeat }) {
  return axios.post(API_URL, {
    operation: 'registerUser',
    params: { username, email, password, passwordRepeat },
  });
}

// Add Friend
// export function addFriend(searchId, friendList, userId) {
//   if (!friendList || friendList === null) {
//     friendList = [];
//   }

//   if (
//     friendList.includes(parseInt(searchId)) ||
//     parseInt(searchId) === userId
//   ) {
//     console.log('includes', friendList, searchId);

//     return async dispatch => {
//       dispatch({
//         type: ADD_FRIEND,
//         friendList,
//       });
//     };
//   }

//   const newFriendList = [...friendList, parseInt(searchId)];
//   console.log('newFriendList', newFriendList);

//   return async dispatch => {
//     try {
//       const { data } = await axios.post(API_URL, {
//         operation: 'addFriend',
//         params: { userId, searchId, newFriendList },
//       });
//       console.log('addFriend data', data);

//       if (data.success) {
//         dispatch({
//           type: ADD_FRIEND,
//           friendList: newFriendList,
//         });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
// }
