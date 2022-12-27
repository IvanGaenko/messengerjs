import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Header from '../components/Header';
import AuthService from '../services/auth.service';
import { getCurrent } from '../slices/user.slice';
import { socket } from '../socket';

const AppLayout = () => {
  const { id } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  let fetched = false;
  useEffect(() => {
    const checkExistingSession = async () => {
      if (AuthService.hasRefreshToken() && !id) {
        if (!fetched) {
          await AuthService.debounceRefreshTokens();
          dispatch(getCurrent());
          // console.log('layout id', id);
        }
      }
    };
    checkExistingSession();
    return () => {
      // console.log('Cleanup!');
      fetched = true;
    };
  }, []);

  useEffect(() => {
    socket.on('connect_error', (err) => {
      console.log('connect_error', err);
      socket.emit('logout', '');
      AuthService.makeLogout();
    });

    socket.on('doLogout', () => {
      // console.log('logout client!');
      AuthService.makeLogout();
    });

    window.addEventListener('beforeunload', () => {
      console.log('before unload');
      socket.emit('beforeunload', socket.id);
    });
    return () => {
      socket.off('connect_error');
      socket.off('doLogout');
      window.removeEventListener('beforeunload', () => {
        console.log('before unload');
        socket.emit('beforeunload', socket.id);
      });
    };
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default AppLayout;
