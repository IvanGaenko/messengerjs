import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import FriendMenu from '../popups/FriendMenu';
import { toggleFriendProfile } from '../../slices/handler.slice';
import { timeAgo } from '../../features/getFormattedDate';

import { BiArrowBack, BiSearch } from 'react-icons/bi';
import { BsThreeDotsVertical, BsThreeDots } from 'react-icons/bs';
import UserIcon from '../../common/UserIcon';

const ChatBodyHeader = ({ handleClick }) => {
  const { activeChat } = useSelector((state) => state.chat);
  const [toggleFriendMenu, setToggleFriendMenu] = useState(false);
  const dispatch = useDispatch();

  const friendMenuRef = useRef();

  useEffect(() => {
    let modalData = null;
    let globalMouseData = {
      x: 0,
      y: 0,
    };
    let modalTimeout = null;

    const handleGlobalMouseMove = (e) => {
      if (modalTimeout === null) {
        if (modalData === null && toggleFriendMenu) {
          modalData = friendMenuRef.current.getBoundingClientRect();
        }

        globalMouseData.x = e.clientX;
        globalMouseData.y = e.clientY;

        modalTimeout = setTimeout(() => {
          modalTimeout = null;
        }, 200);
      }

      if (
        globalMouseData.y > modalData.bottom + 100 ||
        globalMouseData.y < modalData.top - 100 ||
        globalMouseData.x > modalData.right + 100 ||
        globalMouseData.x < modalData.left - 100
      ) {
        toggleFriendMenu && setToggleFriendMenu(false);
      }
    };

    if (toggleFriendMenu) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      if (toggleFriendMenu) {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
      }
    };
  }, [toggleFriendMenu]);

  return (
    <div
      className="flex items-center bg-[#212121] flex-[0_0_auto] justify-between px-4 select-none mb-0 relative w-full z-[1] !cursor-pointer !max-h-14 !min-h-[3.5rem] text-white before:shadow-[0_1px_5px_-1px_rgba(0,0,0,0.21)] before:content-[' '] before:left-0 before:pointer-events-none before:absolute before:right-0 before:top-0 before:h-14"
      onClick={() => dispatch(toggleFriendProfile(true))}
    >
      <div className="flex items-center flex-auto h-14 justify-between max-h-14 max-w-full">
        {/* Back button */}
        <button
          className="transition-none flex-[0_0_auto] h-10 w-10 flex items-center bg-transparent border-none text-[#aaa] text-[1.5rem] justify-center leading-[1] p-2 relative text-center !rounded-[50%] cursor-pointer outline-none m-0 hover:bg-[hsla(0,0%,67%,.08)]"
          onClick={(e) => {
            e.stopPropagation();
            handleClick(null);
          }}
        >
          <BiArrowBack />
        </button>
        {/* Chat Info */}
        <div className="flex-auto max-w-[calc(100% - 192px)] overflow-hidden">
          <div className="flex items-center pl-[0.1875rem]">
            <UserIcon
              username={activeChat.user[0].username}
              style={{
                flex: '0 0 auto',
                lineHeight: '42px',
              }}
            />
            <div className="pl-[1.125rem] flex-auto max-w-full overflow-hidden">
              <div className="">
                <div className="flex items-center text-[1rem] font-medium leading-[1.5rem] max-w-[calc(100% - 1.5rem)]">
                  <span className="leading-[1.3125] overflow-hidden overflow-ellipsis whitespace-nowrap text-[1rem]">
                    {activeChat.user[0].username}
                  </span>
                </div>
              </div>
              <div
                className={`${
                  activeChat.user[0].isOnline ? 'text-[#8774e1]' : 'text-[#aaa]'
                } text-[0.875rem]`}
              >
                <div className="mt-[1px] leading-[1.3125] overflow-hidden overflow-ellipsis whitespace-nowrap flex items-center">
                  {activeChat.isTyping && (
                    <BsThreeDots style={{ marginRight: '5px' }} />
                  )}
                  {activeChat.isTyping
                    ? 'typing'
                    : activeChat.user[0].isOnline
                    ? 'online'
                    : `last seen ${timeAgo(activeChat.user[0].lastActivity)}`}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Chat Utils */}
        <div className="relative z-[1] flex items-center flex-[0_0_auto]">
          <button
            className="ml-2 transition-none overflow-hidden relative select-none flex items-center bg-transparent border-none text-[#aaa] text-[1.5rem] justify-center leading-[1] p-2 text-center !rounded-[50%] cursor-pointer outline-none hover:bg-[hsla(0,0%,67%,.08)]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <BiSearch />
          </button>
          <button
            className={`ml-2 transition-none relative select-none !cursor-pointer !font-normal !overflow-visible !pointer-events-auto flex items-center border-none text-[#aaa] text-[1.5rem] justify-center leading-[1] p-2 text-center !rounded-[50%] outline-none ${
              toggleFriendMenu
                ? 'bg-[rgba(170,170,170,0.08)]'
                : 'bg-transparent hover:bg-[hsla(0,0%,67%,.08)]'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setToggleFriendMenu((prev) => !prev);
            }}
          >
            <BsThreeDotsVertical />
            {toggleFriendMenu && (
              <FriendMenu friendMenuRef={friendMenuRef} />
              // <>
              //   <div className="!max-w-none !fixed !w-auto -bottom-full cursor-default -left-full -right-full -top-full select-none z-[4]"></div>
              //   <div
              //     ref={friendMenuRef}
              //     className="max-h-[calc(4.12px*100-4.375rem)] absolute z-[4] top-[calc(100%+7px)] transition-none mt-2 left-auto right-0 origin-top-right transform !scale-x-100 shadow-[0_0_10px_rgba(0_0_0_0.15)] backdrop-blur-[50px] bg-[rgba(33,33,33,0.75)] rounded-[10px] text-[1rem] min-w-[11.25rem] py-[0.3125rem] px-0 select-none !cursor-pointer !pointer-events-auto leading-[1] text-center"
              //     style={{
              //       overflowY: 'overlay',
              //     }}
              //   >
              //     <div className="text-left flex items-center rounded-[0.3125rem] text-white text-[14px] font-medium h-8 leading-[18px] mx-[0.3125rem] py-1 px-3 relative transform scale-100 whitespace-nowrap !cursor-pointer !pointer-events-auto hover:bg-[rgba(171,171,171,0.08)]">
              //       <BsCheckCircle
              //         style={{
              //           marginRight: '1.25rem',
              //           marginTop: '0.125rem',
              //           fontSize: '1.25rem',
              //         }}
              //       />
              //       <span>Select Messages</span>
              //     </div>
              //     <div className="text-left flex items-center rounded-[0.3125rem] text-[#ff595a] text-[14px] font-medium h-8 leading-[18px] mx-[0.3125rem] py-1 px-3 relative transform scale-100 whitespace-nowrap !cursor-pointer !pointer-events-auto hover:bg-[rgba(171,171,171,0.08)]">
              //       <BiTrashAlt
              //         style={{
              //           marginRight: '1.25rem',
              //           marginTop: '0.125rem',
              //           fontSize: '1.25rem',
              //         }}
              //       />
              //       <span>Delete Chat</span>
              //     </div>
              //   </div>
              // </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBodyHeader;
