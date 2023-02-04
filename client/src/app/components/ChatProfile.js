import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { HiPencil } from 'react-icons/hi';
import { BiArrowBack, BiTrashAlt } from 'react-icons/bi';
import { MdAlternateEmail } from 'react-icons/md';
import UserIcon from '../common/UserIcon';

import { toggleFriendProfile } from '../slices/handler.slice';
import { timeAgo } from '../features/getFormattedDate';

const Profile = () => {
  const [toggleEditProfile, setToggleEditProfile] = useState(false);
  const { activeChat } = useSelector((state) => state.chat);
  const { username, email, isOnline, lastActivity } = activeChat.user[0];
  const dispatch = useDispatch();

  return (
    <div className="min-w-[420px] grid grid-cols-[100%] grid-rows-[100%] w-full flex-auto h-full max-h-full overflow-hidden relative">
      {toggleEditProfile ? (
        <div className="!transition-none flex bg-[#181818] flex-col col-start-1 row-start-1 overflow-hidden">
          <div className="flex-[0_0_auto] relative flex items-center bg-[#212121] cursor-default justify-between min-h-[3.5rem] px-4 select-none after:bg-[#0f0f0f] after:absolute after:bottom-[-1px] after:content-[' '] after:h-[1px] after:left-0 after:opacity-0 after:right-0 after:z-[1]">
            <button
              className="transition-none flex-[0_0_auto] h-10 w-10 overflow-hidden flex items-center bg-transparent border-none text-[#aaaaaa] text-[1.5rem] justify-center leading-[1] p-2 relative text-center !rounded-[50%] cursor-pointer outline-none hover:bg-[hsla(0,0%,67%,.08)]"
              onClick={() => setToggleEditProfile(false)}
            >
              <BiArrowBack />
            </button>
            <div className="pl-6 flex-1 text-white text-[1.25rem] font-medium">
              <span>Edit</span>
            </div>
          </div>
          <div className="min-w-[420px] flex flex-auto h-full max-h-full overflow-hidden relative w-full">
            <div
              className="absolute bottom-0 h-full left-0 max-h-full overflow-x-hidden right-0 top-0 w-full"
              style={{ overflowY: 'overlay', transform: 'translateZ(0)' }}
            >
              <div className="select-none">
                <div className="bg-[#212121] shadow-[0_1px_3px_0_rgba(0_0_0_0.12)] mb-3 !py-2 !px-0">
                  <div className="my-0 mx-2">
                    <button className="transition-none m-0 !text-[#ff595a] relative select-none items-center bg-transparent flex font-medium h-12 leading-[1.3125] py-0 px-4 border-none rounded-[10px] cursor-pointer overflow-hidden text-center w-full hover:bg-[rgba(255,89,90,0.08)]">
                      <BiTrashAlt
                        style={{ marginRight: '2rem', fontSize: '1.5rem' }}
                      />
                      <span>Delete Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="!transition-none flex bg-[#181818] flex-col col-start-1 row-start-1 overflow-hidden">
          <div className="flex-[0_0_auto] relative flex items-center bg-[#212121] cursor-default justify-between min-h-[3.5rem] px-4 select-none text-white after:bg-[#0f0f0f] after:absolute after:bottom-[-1px] after:content-[' '] after:h-[1px] after:left-0 after:opacity-0 after:right-0 after:z-[1]">
            <button
              className="transition-none flex-[0_0_auto] h-10 w-10 overflow-hidden flex items-center bg-transparent border-none text-[#aaaaaa] text-[1.5rem] justify-center leading-[1] p-2 relative text-center rounded-[50%] cursor-pointer outline-none hover:bg-[hsla(0,0%,67%,.08)]"
              onClick={() => dispatch(toggleFriendProfile(false))}
            >
              <div className="bg-[#aaaaaa] rounded-[0.125rem] h-[0.125rem] w-[1.125rem] pointer-events-none absolute transform -rotate-45 before:transform before:rotate-90 before:content-[''] before:left-0 before:absolute before:top-0 before:bg-[#aaaaaa] before:rounded-[0.125rem] before:h-[0.125rem] before:w-[1.125rem] after:content-[''] after:left-0 after:absolute after:top-0 after:bg-[#aaaaaa] after:rounded-[0.125rem] after:h-[0.125rem] after:w-[1.125rem]"></div>
            </button>
            <div className="flex-grow relative">
              <div className="flex items-center h-full absolute left-0 top-0 w-full">
                <div className="pl-6 text-white flex-1 text-[1.25rem] font-medium">
                  <span>Profile</span>
                </div>
                <button
                  className="transition-none overflow-hidden relative select-none flex items-center bg-transparent border-none text-[#aaaaaa] text-[1.5rem] justify-center leading-[1] p-2 text-center rounded-[50%] cursor-pointer outline-none hover:bg-[hsla(0,0%,67%,.08)]"
                  onClick={() => setToggleEditProfile(true)}
                >
                  <HiPencil />
                </button>
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="min-w-[420px] flex flex-auto h-full max-h-full overflow-hidden relative w-full">
            <div
              className="absolute bottom-0 h-full left-0 max-h-full overflow-x-hidden right-0 top-0 w-full"
              style={{ overflowY: 'overlay', transform: 'translateZ(0)' }}
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
                          {isOnline
                            ? 'online'
                            : `last seen ${timeAgo(lastActivity)}`}
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
      )}
    </div>
  );
};

export default Profile;
