import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { accessToken } = useSelector((state) => state.auth);
  return (
    <div>
      <nav>
        <Link to="/chat">Chat</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      {accessToken}
    </div>
  );
};

export default Header;
