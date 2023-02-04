import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import AuthService from '../services/auth.service';
import { setCurrentUser } from '../slices/user.slice';
import {
  setChatList,
  toggleFriendOnline,
  updateFriendData,
  searchMessages,
} from '../slices/chat.slice';
import { socket } from '../socket';
import Loading from '../pages/Loading';

let worker;
let eventsTimeout = null;

const ProtectedRoute = ({ redirectPath = 'login' }) => {
  const [isListenForEvents, setIsListenForEvents] = useState(true);
  const { accessToken, sessionError } = useSelector((state) => state.auth);
  const { id } = useSelector((state) => state.user);
  const { chatList } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('chatUsers', (data) => {
      console.log('chat users in protected route', data);
      dispatch(setChatList(data));
    });

    socket.on('update user data', (data) => {
      dispatch(setCurrentUser(data));
    });

    socket.on('friend online status', (data) => {
      console.log('friend online status', data);
      dispatch(toggleFriendOnline(data));
    });

    socket.on('updateFriendData', (data) => {
      console.log('updateFriendData', data);
      dispatch(updateFriendData(data));
    });

    socket.on('responseSearchMessages', (data) => {
      console.log('responseSearchMessages', data);
      dispatch(searchMessages(data));
    });

    return () => {
      socket.off('chatUsers');
      socket.off('update user data');
      socket.off('friend online status');
      socket.off('responseSearchMessages');
    };
  }, []);
  //-------------------------------------------------------
  useEffect(() => {
    worker = new Worker('./logout.worker.js');

    worker.addEventListener('message', (e) => {
      if (e.data === 'logout') {
        socket.emit('setAdminOffline', '');
        console.log('Proceed to logout');
      }
    });

    worker.postMessage('enableTimeout');

    socket.on('doRefreshActivity', () => {
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

      if (eventsTimeout !== null) {
        clearTimeout(eventsTimeout);
        console.log('timeout cleared', eventsTimeout);
      }
    };
  }, []);

  const onClickHandler = () => {
    worker.postMessage('disableTimeout');
    worker.postMessage('enableTimeout');
    socket.emit('onRefreshActivity', '');
    setIsListenForEvents(false);

    eventsTimeout = setTimeout(() => {
      setIsListenForEvents(true);
      eventsTimeout = null;
    }, 5 * 1000);
  };

  if (!accessToken && AuthService.hasRefreshToken()) {
    return <Loading />;
  }

  if (!accessToken && !AuthService.hasRefreshToken()) {
    return <Navigate to={redirectPath} replace />;
  }

  if (sessionError) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <>
      {id && chatList.id && (
        <div
          className="flex h-full max-h-full min-h-full overflow-hidden relative w-full min-w-full opacity-100"
          onClick={isListenForEvents ? onClickHandler : undefined}
        >
          <Outlet />
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
