import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import AuthService from '../services/auth.service';
import { socket } from '../socket';
import { getCurrent } from '../slices/user.slice';

import AddContact from '../components/AddContact';

const AppLayout = () => {
  const { id } = useSelector((state) => state.user);
  const { isOpenAddUserModal } = useSelector((state) => state.handler);
  const dispatch = useDispatch();

  let fetched = false;

  const checkExistingSession = async () => {
    if (AuthService.hasRefreshToken() && !id) {
      if (!fetched) {
        await AuthService.debounceRefreshTokens();
        dispatch(getCurrent());
        // console.log('layout id', id);
      }
    }
  };

  useEffect(() => {
    checkExistingSession();

    socket.on('connect_error', (err) => {
      console.log('connect_error', err);
      if (err.name === 'jwt expired') {
        checkExistingSession();
      } else {
        socket.emit('logout', '');
        AuthService.makeLogout();
      }
    });

    socket.on('doLogout', () => {
      AuthService.makeLogout();
    });

    return () => {
      socket.off('connect_error');
      socket.off('doLogout');
      // console.log('Cleanup!');
      fetched = true;
    };
  }, []);

  return (
    <div className="h-full min-h-full w-full !max-w-[1682px] mx-auto my-0 flex">
      <Outlet />
      {isOpenAddUserModal && <AddContact />}
    </div>
  );
};

export default AppLayout;
