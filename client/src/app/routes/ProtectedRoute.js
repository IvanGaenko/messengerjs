import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import AuthService from '../services/auth.service';
import { setCurrentUser } from '../slices/user.slice';
import { setChatList, toggleFriendOnline } from '../slices/chat.slice';
import { socket } from '../socket';

let worker;
// let refreshStatusTimeout = null;

const ProtectedRoute = ({ redirectPath = 'login' }) => {
  const { accessToken, sessionError } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('chatUsers', (data) => {
      console.log('chat users in protected route', data);
      dispatch(setChatList(data));
    });

    socket.on('update user data', (data) => {
      dispatch(
        setCurrentUser({
          isOnline: data.isOnline,
        }),
      );
    });

    socket.on('friend online status', (data) => {
      console.log('friend online status', data);
      // if (data.online === false) {
      //   refreshStatusTimeout = setTimeout(() => {
      //     dispatch(toggleFriendOnline(data));
      //     refreshStatusTimeout = null;
      //   }, 5 * 1000);
      // }

      // if (data.online === true) {
      //   if (refreshStatusTimeout === null) {
      //     dispatch(toggleFriendOnline(data));
      //   } else {
      //     clearTimeout(refreshStatusTimeout);
      //     refreshStatusTimeout = null;
      //   }
      // }
      dispatch(toggleFriendOnline(data));
    });

    return () => {
      socket.off('chatUsers');
      socket.off('update user data');
      socket.off('friend online status');
    };
  });
  //-------------------------------------------------------
  useEffect(() => {
    worker = new Worker('./logout.worker.js');
    // console.log('new worker', worker);

    worker.addEventListener('message', (e) => {
      if (e.data === 'logout') {
        socket.emit('setAdminOffline', '');
        console.log('Proceed to logout');
      }
    });

    worker.postMessage('enableTimeout');

    socket.on('doRefreshActivity', () => {
      // console.log('refreshed in client', socket.id);
      worker.postMessage('disableTimeout');
      worker.postMessage('enableTimeout');
    });

    return () => {
      worker.removeEventListener('message', (e) => {
        if (e.data === 'logout') {
          socket.emit('setAdminOffline', '');
        }
      });

      console.log('terminate');
      worker.terminate();
      socket.off('doRefreshActivity');
    };
  }, []);

  const onClickHandler = () => {
    // console.log('socket in protected route', socket);
    // if (!socket.connected) {
    //   socket.connect();
    // }
    worker.postMessage('disableTimeout');
    worker.postMessage('enableTimeout');
    socket.emit('onRefreshActivity', '');
  };

  if (!accessToken && AuthService.hasRefreshToken()) {
    return <p>Loading...</p>;
  }

  if (!accessToken && !AuthService.hasRefreshToken()) {
    return <Navigate to={redirectPath} replace />;
  }

  if (sessionError) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="h-screen bg-orange-400" onClick={onClickHandler}>
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;

//-------------------------------------------------------
// useEffect(() => {
//   // const setupListeners = () => {
//   console.log('start');
//   worker = new Worker('./logout.worker.js');

//   worker.addEventListener('message', (e) => {
//     if (e.data === 'logout') {
//       socket.emit('setAdminOffline', '');
//       console.log('Proceed to logout');
//     }
//   });

//   window.addEventListener('blur', () => {
//     console.log('blur');
//     worker.postMessage('enableTimeout');
//   });

//   window.addEventListener('click', () => {
//     if (!socket.connected) {
//       console.log('connect via click');
//       socket.connect();
//     }
//     console.log('worker in click', worker);
//     worker.postMessage('disableTimeout');
//   });
//   // };

//   // if (!listenersSetuped) {
//   //   setupListeners();
//   //   listenersSetuped = true;
//   // }
//   // console.log('worker', worker);

//   return () => {
//     // if (!listenersSetuped) {
//     worker.removeEventListener('message', (e) => {
//       if (e.data === 'logout') {
//         socket.emit('setAdminOffline', '');
//         console.log('Proceed to logout');
//       }
//     });

//     window.removeEventListener('blur', () => {
//       worker.postMessage('enableTimeout');
//     });

//     window.removeEventListener('click', () => {
//       if (!socket.connected) {
//         socket.connect();
//       }
//       worker.postMessage('disableTimeout');
//     });

//     // listenersSetuped = true;
//     console.log('terminate');
//     worker.terminate();
//     // }
//   };
// }, []);
