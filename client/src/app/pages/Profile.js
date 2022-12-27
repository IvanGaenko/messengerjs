import { useSelector } from 'react-redux';

import AuthService from '../services/auth.service';
import { socket } from '../socket';

const Profile = () => {
  const { id, username, email } = useSelector((state) => state.user);

  const onLogout = () => {
    // console.log('logout');
    socket.emit('logout', '');
    AuthService.makeLogout();
  };

  return (
    <>
      <p>Profile</p>
      <p>ID: {id}</p>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      <button onClick={onLogout}>Log Out</button>
    </>
  );
};

export default Profile;
