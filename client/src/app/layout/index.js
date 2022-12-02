import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Header from '../components/Header';
import AuthService from '../services/auth.service';
import { getCurrent } from '../slices/user.slice';

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
          console.log('layout id', id);
        }
      }
    };
    checkExistingSession();
    return () => {
      console.log('Cleanup!');
      fetched = true;
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
