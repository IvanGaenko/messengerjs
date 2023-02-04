import { useState, useEffect } from 'react';

const UserIcon = ({
  username = 'User',
  isOnline = false,
  status = false,
  isSelected = false,
  style,
}) => {
  const [identifier, setIdentifier] = useState(0);
  // const colors = ['green', 'violet', 'cyan', 'pink', 'orange'];
  const colors = [
    { top: '#9ad164', bottom: '#46ba43' },
    { top: '#b694f9', bottom: '#6c61df' },
    { top: '#53edd6', bottom: '#28c9b7' },
    { top: '#ff8aac', bottom: '#d95574' },
    { top: '#febb5b', bottom: '#f68136' },
  ];

  useEffect(() => {
    if (username.trim().length > 0) {
      const newIdentifier =
        username[0].toUpperCase().charCodeAt() % colors.length;
      setIdentifier(newIdentifier);
    }
  }, [username, identifier]);

  return (
    <div
      className={`w-[42px] min-w-[42px] h-[42px] min-h-[42px] flex justify-center items-center rounded-[50%] font-medium relative text-white text-base select-none`}
      style={{
        ...style,
        background: `linear-gradient(${colors[identifier].top}, ${colors[identifier].bottom})`,
        userSelect: 'none',
      }}
    >
      {username.trim().length > 0 ? username.slice(0, 2).toUpperCase() : ''}
      {isOnline && status && (
        <div
          className={`absolute bg-[#0ac630] top-[2.4375rem] left-[2.4375rem] w-[14px] h-[14px] rounded-[50%] border-2 ${
            isSelected ? 'border-[#8774e1]' : 'border-[#212121]'
          }`}
        >
          {' '}
        </div>
      )}
    </div>
  );
};

export default UserIcon;
