import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthService from '../services/auth.service';

const Header = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const { username, isOnline } = useSelector((state) => state.user);

  return (
    <div>
      <nav>
        {accessToken && AuthService.hasRefreshToken() ? (
          <>
            <Link to="/chat">Chat</Link>{' '}
            {username && <Link to={username}>{username}</Link>}{' '}
            {isOnline ? 'online' : 'offline'}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Header;
