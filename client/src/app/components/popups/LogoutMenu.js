import AuthService from '../../services/auth.service';
import { socket } from '../../socket';

import { HiOutlineLogout } from 'react-icons/hi';

const LogoutMenu = ({ logoutMenuRef }) => {
  const onLogout = () => {
    socket.emit('logout', '');
    AuthService.makeLogout();
  };

  return (
    <>
      <div className="!max-w-none !fixed !w-auto -bottom-full cursor-default -left-full -right-full -top-full select-none z-[4]"></div>
      <div
        ref={logoutMenuRef}
        className="transition-none overflow-y-[overlay] mt-2 left-auto right-0 top-full origin-top-right transform !scale-x-100 shadow-[0_0_10px_rgba(0_0_0_0.15)] backdrop-blur-[50px] bg-[rgba(33,33,33,0.75)] rounded-[10px] text-[1rem] min-w-[11.25rem] py-[0.3125rem] px-0 absolute select-none z-[4]"
      >
        <div
          className="text-left flex items-center rounded-[0.3125rem] text-white text-[14px] font-medium h-8 leading-[18px] mx-[0.3125rem] py-1 px-3 relative transform scale-100 whitespace-nowrap !cursor-pointer !pointer-events-auto hover:bg-[rgba(171,171,171,0.08)]"
          onClick={onLogout}
        >
          <HiOutlineLogout
            style={{
              marginRight: '1.25rem',
              position: 'relative',
              alignSelf: 'flex-start',
              color: 'white',
              fontSize: '1.25rem',
              marginTop: '0.125rem',
            }}
          />
          <span className="pointer-events-none flex-auto relative">
            Log Out
          </span>
        </div>
      </div>
    </>
  );
};

export default LogoutMenu;
