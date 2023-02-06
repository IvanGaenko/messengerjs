import { useSelector } from 'react-redux';

import LogoutMenu from '../popups/LogoutMenu';
import { timeAgo } from '../../features/getFormattedDate';

import { HiPencil } from 'react-icons/hi';
import { MdAlternateEmail } from 'react-icons/md';
import { BiArrowBack } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import UserIcon from '../../common/UserIcon';

const Settings = ({
  toggleLogoutMenu,
  logoutMenuRef,
  setToggleSettings,
  setToggleEditProfile,
  setToggleLogoutMenu,
}) => {
  const { username, email } = useSelector((state) => state.user);
  const { chatList } = useSelector((state) => state.chat);

  return (
    <div className="!transition-none flex bg-[#181818] flex-col col-start-1 row-start-1 overflow-hidden">
      <div className="relative flex items-center bg-[#212121] cursor-default flex-[0_0_auto] justify-between min-h-[3.5rem] px-4 select-none after:bg-[#0f0f0f] after:absolute after:bottom-[-1px] after:content-[' '] after:h-[1px] after:left-0 after:opacity-0 after:right-0 after:z-[1]">
        <button
          className="transition-none flex-[0_0_auto] h-10 w-10 overflow-hidden flex items-center bg-transparent border-none text-[#aaa] text-[1.5rem] justify-center leading-[1] p-2 relative text-center !rounded-[50%] cursor-pointer outline-none hover:bg-[rgba(171,171,171,0.08)]"
          onClick={() => setToggleSettings((prev) => !prev)}
        >
          <BiArrowBack />
        </button>
        <div className="pl-6 text-white flex-1 text-[1.25rem] font-medium">
          Settings
        </div>
        <button
          className="transition-none overflow-hidden relative select-none flex items-center bg-transparent border-none text-[#aaa] text-[1.5rem] justify-center leading-[1] p-2 text-center !rounded-[50%] cursor-pointer outline-none hover:bg-[rgba(171,171,171,0.08)]"
          onClick={() => {
            setToggleEditProfile((prev) => !prev);
          }}
        >
          <HiPencil />
        </button>
        <button
          className="ml-2 transition-none relative select-none cursor-pointer font-normal overflow-visible pointer-events-auto flex items-center bg-transparent border-none text-[#aaa] text-[1.5rem] justify-center leading-[1] p-2 text-center !rounded-[50%] outline-none hover:bg-[rgba(171,171,171,0.08)]"
          onClick={() => setToggleLogoutMenu((prev) => !prev)}
        >
          <BsThreeDotsVertical />
          {toggleLogoutMenu && <LogoutMenu logoutMenuRef={logoutMenuRef} />}
        </button>
      </div>
      <div className="flex flex-auto h-full max-h-full overflow-hidden relative w-full">
        <div
          className="absolute bottom-0 h-full left-0 max-h-full overflow-x-hidden right-0 top-0 w-full"
          style={{
            overflowY: 'overlay',
            transform: 'translateZ(0)',
          }}
        >
          <div className="flex flex-col relative w-full">
            <div className="select-none">
              <div className="relative bg-[#212121] shadow-[0_1px_3px_0_rgba(0_0_0_0.12)] mb-3 !px-0 !py-2">
                <div className="mx-2 my-0">
                  <UserIcon
                    username={username}
                    style={{
                      height: '120px',
                      width: '120px',
                      minHeight: '120px',
                      minWidth: '120px',
                      fontSize: 'calc(1.25rem/0.45)',
                      textAlign: 'center',
                      userSelect: 'none',
                      marginTop: '0.5rem',
                      marginBottom: '10px',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  />
                  <div className="justify-center items-end text-white flex text-[20px] font-medium leading-[26px] my-0 mx-auto max-w-[21.25rem] overflow-hidden text-center">
                    {username}
                  </div>
                  <div className="flex items-center text-[#aaa] text-[0.875rem] justify-center mb-[0.875rem] mt-[1px] text-center">
                    <span className="text-[#8774e1]">
                      {chatList.isOnline
                        ? 'online'
                        : `last seen ${timeAgo(chatList.lastActivity)}`}
                    </span>
                  </div>
                  <div className="pl-[4.5rem] rounded-[10px] cursor-pointer overflow-hidden flex flex-col justify-center min-h-[3.5rem] py-[0.4375rem] px-4 relative hover:bg-[hsla(0,0%,67%,.08)]">
                    <MdAlternateEmail
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        color: '#aaa',
                        fontSize: '1.5rem',
                        pointerEvents: 'none',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                      }}
                    />
                    <div className="pointer-events-none relative !text-[#aaa] !text-[14px] mt-[0.1875rem] leading-[18px] order-1">
                      Email
                    </div>
                    <div className="text-white text-[16px] leading-[1.3125] overflow-hidden overflow-ellipsis break-words relative pointer-events-none">
                      {email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
