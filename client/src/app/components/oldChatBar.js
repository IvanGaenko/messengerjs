import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AuthService from '../services/auth.service';
import {
  addMessage,
  typingStatus,
  updateReceiptStatus,
} from '../slices/chat.slice';
import {
  setAddUserModal,
  // setGlobalMouseMove,
  // setModalElement,
} from '../slices/handler.slice';

import { MdClose } from 'react-icons/md';
import { HiPencil, HiOutlineLogout } from 'react-icons/hi';
import { MdOutlineDarkMode, MdAlternateEmail } from 'react-icons/md';
import {
  BiCheck,
  BiCheckDouble,
  BiSearch,
  BiArrowBack,
  BiImageAdd,
} from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import { BsThreeDotsVertical } from 'react-icons/bs';
import UserIcon from '../common/UserIcon';

import { socket } from '../socket';
import { timeAgo } from '../features/getFormattedDate';

let typingTimeout = null;

const ChatBar = ({ conversations, handleClick }) => {
  const { id, username, email } = useSelector((state) => state.user);
  const { chatList, activeChat, searchMessagesData } = useSelector(
    (state) => state.chat,
  );
  const { isOpenAddUserModal } = useSelector((state) => state.handler);
  const dispatch = useDispatch();
  console.log('conversations', conversations);

  const [searchInputFocus, setSearchInputFocus] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchInputMode, setSearchInputMode] = useState(false);

  const [editUsernameHover, setEditUsernameHover] = useState(false);
  const [editUsernameFocus, setEditUsernameFocus] = useState(false);
  const [editUsernameValue, setEditUsernameValue] = useState(username);

  const [editEmailHover, setEditEmailHover] = useState(false);
  const [editEmailFocus, setEditEmailFocus] = useState(false);
  const [editEmailValue, setEditEmailValue] = useState(email);

  const [toggleMainMenu, setToggleMainMenu] = useState(false);
  const [toggleLogoutMenu, setToggleLogoutMenu] = useState(false);
  const [toggleSettings, setToggleSettings] = useState(false);
  const [toggleEditProfile, setToggleEditProfile] = useState(false);
  const [toggleDarkMode, setToggleDarkMode] = useState(false);

  const mainMenuRef = useRef();
  const logoutMenuRef = useRef();

  useEffect(() => {
    socket.on('message', (data) => {
      console.log('client message', data);
      dispatch(addMessage(data));
    });

    socket.on('typingResponse', (data) => {
      clearTimeout(typingTimeout);
      dispatch(typingStatus({ ...data, isTyping: true }));

      typingTimeout = setTimeout(() => {
        dispatch(typingStatus({ ...data, isTyping: false }));
        typingTimeout = null;
      }, 2 * 1000);
    });

    socket.on('notify-read-rcpt', (data) => {
      console.log('notify-read-rcpt', data);
      dispatch(updateReceiptStatus(data));
    });

    return () => {
      socket.off('message');
      socket.off('typingResponse');
      socket.off('notify-read-rcpt');
    };
  }, []);

  useEffect(() => {
    let modalData = null;
    let globalMouseData = {
      x: 0,
      y: 0,
    };
    let modalTimeout = null;

    const handleGlobalMouseMove = (e) => {
      if (modalTimeout === null) {
        if (modalData === null && toggleMainMenu) {
          modalData = mainMenuRef.current.getBoundingClientRect();
        }
        if (modalData === null && toggleLogoutMenu) {
          modalData = logoutMenuRef.current.getBoundingClientRect();
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
        toggleMainMenu && setToggleMainMenu(false);
        toggleLogoutMenu && setToggleLogoutMenu(false);
      }
    };

    if (toggleMainMenu || toggleLogoutMenu) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      if (toggleMainMenu || toggleLogoutMenu) {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
      }
    };
  }, [toggleMainMenu, toggleLogoutMenu]);

  const searchInputOnChange = (value) => {
    if (value.length > 2) {
      socket.emit('searchMessages', value);
    }
    setSearchInputValue(value);
  };

  const onLogout = () => {
    socket.emit('logout', '');
    AuthService.makeLogout();
  };

  const onSubmitEditUser = () => {
    const userChanges = {};
    if (username !== editUsernameValue)
      userChanges.username = editUsernameValue;
    if (email !== editEmailValue) userChanges.email = editEmailValue;
    console.log('submit user changes', userChanges);
    socket.emit('changeUserProfileData', userChanges);
    setToggleEditProfile(false);
  };

  return (
    <div
      className="flex xl:flex-auto flex-grow-[2] flex-shrink flex-col max-w-[420px] min-w-[min(100%,18rem)] h-full max-h-full min-h-full relative bg-[#181818] after:right-[-1px] after:bg-[#0f0f0f] after:content-[' '] after:block after:h-screen after:absolute after:top-0 after:w-[1px] after:z-[2]"
      style={{
        gridColumnStart: 1,
        overflow: 'visible',
        flexBasis: '0%',
      }}
    >
      <div className="h-full w-full min-w-full grid grid-rows-[100%] grid-cols-[100%]">
        {toggleSettings ? (
          toggleEditProfile ? (
            <div className="!transition-none flex bg-[#181818] flex-col col-start-1 row-start-1 overflow-hidden">
              <div className="relative flex items-center bg-[#212121] cursor-default flex-[0_0_auto] justify-between min-h-[3.5rem] px-4 select-none after:absolute after:bg-[#0f0f0f] after:bottom-[-1px] after:content-[' '] after:h-[1px] after:left-0 after:opacity-0 after:right-0 after:z-[1]">
                <button
                  className="transition-none flex-[0_0_auto] h-10 w-10 overflow-hidden flex items-center bg-transparent border-none text-[#aaa] text-[1.5rem] justify-center leading-[1] p-2 relative text-center !rounded-[50%] cursor-pointer outline-none hover:bg-[rgba(171,171,171,0.08)]"
                  onClick={() => {
                    setToggleEditProfile(false);
                    setEditUsernameValue(username);
                    setEditEmailValue(email);
                  }}
                >
                  <BiArrowBack />
                </button>
                <div className="pl-6 text-white flex-1 text-[1.25rem] font-medium">
                  Edit Profile
                </div>
              </div>
              <div className="flex flex-col flex-auto h-full max-h-full overflow-hidden relative w-full">
                <div
                  className="overflow-y-[overlay] absolute bottom-0 h-full left-0 max-h-full overflow-x-hidden right-0 top-0 w-full"
                  style={{
                    transform: 'translateZ(0)',
                  }}
                >
                  <div className="select-none">
                    <div className="bg-[#212121] shadow-[0_1px_3px_0_rgba(0_0_0_0.12)] mb-3 !py-2 !px-0">
                      <div className="my-0 mx-2">
                        <div className="h-[120px] w-[120px] mt-4 mx-auto mb-8 rounded-[50%] cursor-pointer overflow-hidden relative">
                          <canvas className="bg-gradient-to-b from-[#69bffa] to-[#3d9de0] h-full max-h-full w-full max-w-full inline-block" />
                          <span className="absolute text-white text-[3rem] h-12 top-[52%] left-[50%] leading-[1] transform translate-y-[-50%] translate-x-[-50%] w-12 z-[2]">
                            <BiImageAdd />
                          </span>
                          <UserIcon
                            username={username}
                            style={{
                              position: 'absolute',
                              height: '100%',
                              left: 0,
                              top: 0,
                              width: '100%',
                              filter: 'brightness(0.7)',
                              fontSize: 'calc(1.25rem/0.45)',
                              fontWeight: 500,
                            }}
                          />
                        </div>
                        <div className="w-[420px] my-3 mx-0 max-w-full py-0 px-3">
                          <div className="relative">
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onMouseEnter={() => setEditUsernameHover(true)}
                              onMouseLeave={() => setEditUsernameHover(false)}
                              onInput={(e) =>
                                setEditUsernameValue(e.target.textContent)
                              }
                              onClick={() => setEditUsernameFocus(true)}
                              onBlur={() => setEditUsernameFocus(false)}
                              className="!transition-none cursor-text outline-none select-text whitespace-pre-wrap bg-transparent caret-[#8774e1] text-white border-[1px] border-[#2f2f2f] hover:border-[#8774e1] rounded-[10px] box-border leading-[1.3125] min-h-[54px] py-[calc(1rem-1px)] px-[calc(1rem-1px)] relative w-full z-[1]"
                            >
                              {username}
                            </div>
                            {editUsernameFocus && (
                              <div className="border-[2px] border-[#8774e1] rounded-[10px] absolute bottom-0 left-0 pointer-events-none right-0 top-0 z-[1]"></div>
                            )}
                            <label
                              className={`bg-[#212121] ${
                                editUsernameFocus || editUsernameHover
                                  ? 'text-[#8774e1]'
                                  : 'text-[#9e9e9e]'
                              } h-6 mt-[calc((54px-1.5rem)/2)] pointer-events-none absolute right-auto top-0 origin-[left_center] select-none whitespace-nowrap z-[2] left-4 py-0 opacity-100 px-[0.3125rem] transform ${
                                editUsernameValue.length > 0 ||
                                editUsernameFocus
                                  ? 'translate-x-[-0.1875rem] translate-y-[calc(54px/-2+0.0625rem)] scale-75'
                                  : 'translate-x-0 translate-y-0'
                              }`}
                            >
                              Username
                            </label>
                          </div>
                          <div className="relative mt-6">
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onMouseEnter={() => setEditEmailHover(true)}
                              onMouseLeave={() => setEditEmailHover(false)}
                              onInput={(e) =>
                                setEditEmailValue(e.target.textContent)
                              }
                              onClick={() => setEditEmailFocus(true)}
                              onBlur={() => setEditEmailFocus(false)}
                              className="!transition-none cursor-text outline-none select-text whitespace-pre-wrap bg-transparent caret-[#8774e1] text-white border-[1px] border-[#2f2f2f] hover:border-[#8774e1] rounded-[10px] box-border leading-[1.3125] min-h-[54px] py-[calc(1rem-1px)] px-[calc(1rem-1px)] relative w-full z-[1]"
                            >
                              {email}
                            </div>
                            {editEmailFocus && (
                              <div className="border-[2px] border-[#8774e1] rounded-[10px] absolute bottom-0 left-0 pointer-events-none right-0 top-0 z-[1]"></div>
                            )}
                            <label
                              className={`bg-[#212121] ${
                                editEmailFocus || editEmailHover
                                  ? 'text-[#8774e1]'
                                  : 'text-[#9e9e9e]'
                              } h-6 mt-[calc((54px-1.5rem)/2)] pointer-events-none absolute right-auto top-0 origin-[left_center] select-none whitespace-nowrap z-[2] left-4 py-0 opacity-100 px-[0.3125rem] transform ${
                                editEmailValue.length > 0 || editEmailFocus
                                  ? 'translate-x-[-0.1875rem] translate-y-[calc(54px/-2+0.0625rem)] scale-75'
                                  : 'translate-x-0 translate-y-0'
                              }`}
                            >
                              Email
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {(username !== editUsernameValue ||
                  email !== editEmailValue) && (
                  <button
                    className="!transition-none right-5 select-none rounded-[50%] h-[54px] w-[54px] leading-[54px] flex items-center text-[1.5rem] bg-[#8774e1] border-none bottom-5 text-white cursor-pointer justify-center outline-none text-center transform-gpu translate-x-0 translate-y-0 z-[3] !shadow-none !p-0 !absolute hover:bg-[#6a52da]"
                    onClick={onSubmitEditUser}
                  >
                    <BiCheck />
                  </button>
                )}
              </div>
            </div>
          ) : (
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
                  {toggleLogoutMenu && (
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
                  )}
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
          )
        ) : (
          <div className="bg-[#212121] flex flex-col col-start-1 row-start-1 overflow-hidden">
            <div className="flex flex-[0_0_auto] justify-between items-center bg-[#212121] cursor-default min-h-[3.5rem] px-4">
              <div className="flex flex-[0_0_auto] justify-center items-center relative w-10 h-10 cursor-default">
                {searchInputMode ? (
                  <div
                    className={`
              before:top-[-0.3125rem] before:absolute before:left-0 before:content-[''] before:bg-[#aaa] before:rounded-[0.125rem] before:h-[0.125rem] before:w-[1.125rem] before:transform before:rotate-45 before:scale-x-75 before:translate-x-[0.1875rem]
              absolute content-[''] bg-[#aaa] rounded-[0.125rem] h-[0.125rem] w-[1.125rem] transform rotate-180
              after:top-[0.3125rem] after:absolute after:left-0 after:content-[''] after:bg-[#aaa] after:rounded-[0.125rem] after:h-[0.125rem] after:w-[1.125rem] after:transform after:-rotate-45 after:scale-x-75 after:translate-x-[0.1875rem]
              `}
                  ></div>
                ) : (
                  <div
                    className={`
                before:top-[-0.3125rem] before:absolute before:left-0 before:content-[''] before:bg-[#aaa] before:rounded-[0.125rem] before:h-[0.125rem] before:w-[1.125rem] before:transform before:rotate-0
                absolute content-[''] bg-[#aaa] rounded-[0.125rem] h-[0.125rem] w-[1.125rem] transform rotate-0
                after:top-[0.3125rem] after:absolute after:left-0 after:content-[''] after:bg-[#aaa] after:rounded-[0.125rem] after:h-[0.125rem] after:w-[1.125rem] after:transform after:rotate-0
                `}
                  ></div>
                )}
                <button
                  onClick={() => {
                    setToggleMainMenu((prev) => !prev);
                  }}
                  className={`${
                    searchInputMode
                      ? 'opacity-0 invisible'
                      : 'opacity-100 visible'
                  } absolute bottom-0 left-0 m-0 right-0 top-0 z-[4] w-full !cursor-pointer !font-normal flex justify-center items-center border-none text-[#aaa] text-2xl leading-none p-2 text-center !rounded-[50%] outline-none ${
                    toggleMainMenu
                      ? 'bg-[hsla(0,0%,67%,.08)]'
                      : 'bg-transparent '
                  } hover:bg-[hsla(0,0%,67%,.08)]`}
                >
                  {toggleMainMenu && (
                    <>
                      <div className="!w-auto !fixed !max-w-none -bottom-full cursor-default -left-full -right-full -top-full select-none z-[4]"></div>
                      <div
                        ref={mainMenuRef}
                        className="max-h-[calc(4.32px*100 - 3.75rem)] min-w-[260px] transition-none overlay-y-[overlay] mt-2 pb-0 left-0 right-auto top-full origin-top-left transform !scale-x-100 opacity-100 visible shadow-[0_0_10px_rgba(0_0_0_0.15)] backdrop-filter backdrop-blur-[50px] bg-[rgba(33,33,33,0.75)] rounded-[10px] text-[1rem] py-[0.3125rem] px-0 absolute z-[4] select-none"
                      >
                        <div
                          className="!cursor-pointer !pointer-events-auto flex items-center rounded-[0.3125rem] text-white text-[14px] font-medium h-8 leading-[18px] mx-[0.3125rem] py-1 pl-3 relative transform scale-100 whitespace-nowrap text-left pr-[0.375rem] hover:bg-[rgba(171,171,171,0.08)]"
                          onClick={() => setToggleSettings((prev) => !prev)}
                        >
                          <IoSettingsOutline
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
                            Settings
                          </span>
                        </div>
                        <div
                          className="!cursor-pointer !pointer-events-auto flex items-center rounded-[0.3125rem] text-white text-[14px] font-medium h-8 leading-[18px] mx-[0.3125rem] py-1 pl-3 relative transform scale-100 whitespace-nowrap text-left pr-[0.375rem] hover:bg-[rgba(171,171,171,0.08)]"
                          onClick={() => setToggleDarkMode((prev) => !prev)}
                        >
                          <MdOutlineDarkMode
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
                            Dark Mode
                          </span>
                          <label className="cursor-pointer min-h-[20px] min-w-[20px] relative pointer-events-none flex items-center my-0 mx-[0.3125rem] p-0 text-left">
                            <input
                              type="checkbox"
                              checked={toggleDarkMode}
                              onChange={() =>
                                setToggleDarkMode((prev) => !prev)
                              }
                              className="box-border opacity-0 p-0 absolute z-[-1] bg-transparent caret-[#8774e1] text-white overflow-visible leading-[1.15] m-0 text-[100%]"
                            />
                            <div
                              className={`flex relative items-center  rounded-xl h-[0.875rem] my-0 mx-[3px] w-[1.9375rem] before:bg-[#212121] before:border-[2px] before:rounded-[50%] before:content-[' '] before:h-[1.25rem] before:absolute before:transform before:w-[1.25rem] ${
                                toggleDarkMode
                                  ? 'bg-[#8774e1] before:border-[#8774e1] before:translate-x-[calc((1.9375rem-1.25rem)+3px)]'
                                  : 'bg-[#707579] before:translate-x-[calc(3px*-1)] before:border-[#707579]'
                              }`}
                            ></div>
                          </label>
                        </div>
                        <a
                          className="flex items-center rounded-bl-[10px] rounded-br-[10px] text-current text-[0.875rem] h-10 justify-center"
                          href="https://github.com/IvanGaenko/messengerjs"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>My messenger 1.1.0</span>
                        </a>
                      </div>
                    </>
                  )}
                </button>
                <div
                  onClick={() => {
                    searchInputOnChange('');
                    setSearchInputMode(false);
                  }}
                  className={`absolute bottom-0 left-0 right-0 top-0 m-0 ${
                    searchInputMode
                      ? 'opacity-100 visible'
                      : 'opacity-0 invisible'
                  } z-[4] flex items-center bg-transparent border-none text-[#aaa] text-2xl leading-none justify-center p-2 text-center !rounded-[50%] outline-none hover:bg-[hsla(0,0%,67%,.08)] cursor-pointer`}
                ></div>
              </div>
              <div className="w-full relative overflow-hidden mx-[0.4375rem]">
                <input
                  type="text"
                  autoComplete="off"
                  dir="auto"
                  value={searchInputValue}
                  onChange={(e) => searchInputOnChange(e.target.value)}
                  onFocus={() => {
                    setToggleMainMenu(false);
                    setSearchInputFocus(true);
                    setSearchInputMode(true);
                  }}
                  onBlur={() => setSearchInputFocus(false)}
                  placeholder="Search"
                  style={{
                    appearance: 'none',
                    caretColor: '#8774e1',
                  }}
                  className={`bg-[#181818] border-[#2f2f2f] h-[42px] !min-h-[42px] !max-h-[42px] leading-[42px] px-[44px] border border-solid rounded-[22px] box-border relative w-full z-[1] outline-none hover:!border-[#707579] focus:bg-transparent focus:border-[#8774e1]`}
                />
                <div
                  className={`border-2 border-solid border-[#8774e1] rounded-[22px] absolute bottom-0 left-0 right-0 top-0 z-[1] pointer-events-none ${
                    searchInputFocus ? 'opacity-100' : 'opacity-0'
                  }`}
                ></div>
                <i
                  className={`absolute left-[0.8125rem] h-6 w-6 
                ${
                  searchInputFocus
                    ? 'text-[#8774e1] opacity-100'
                    : 'text-[#aaa] opacity-60'
                } 
                text-2xl leading-[1] text-center top-[50%] z-[1] translate-y-[-50%]`}
                  style={{
                    pointerEvents: 'none',
                  }}
                >
                  <BiSearch />
                </i>
                <i
                  className={`absolute text-2xl leading-[1] right-0 h-[42px] w-[42px] z-[1] ${
                    searchInputFocus
                      ? 'text-[#8774e1] opacity-100'
                      : 'text-[#aaa] opacity-60'
                  } ${
                    searchInputValue.length > 0 ? 'block' : 'hidden'
                  } text-center top-[50%] translate-y-[-50%] flex items-center bg-transparent border-none justify-center p-2 rounded-[50%] cursor-pointer outline-none before:mr-[-1px]`}
                  onClick={() => searchInputOnChange('')}
                >
                  <MdClose />
                </i>
              </div>
            </div>
            {/* Body */}
            <div className="flex flex-auto justify-center h-full max-h-full overflow-hidden relative w-full">
              {searchInputMode ? (
                <div className="h-full left-0 max-h-full overflow-hidden absolute w-full z-[3] !top-0 !hidden">
                  <div
                    className="relative flex-auto w-full bottom-0 h-full left-0 max-h-full overflow-x-hidden right-0 top-0"
                    style={{
                      overflowY: 'overlay',
                      transform: 'translateZ(0)',
                    }}
                  >
                    <div className="bg-[#212121] flex flex-col max-w-full min-h-full absolute w-full">
                      <div className="flex-auto grid-rows-[100%] min-h-[calc(100%-49px)] grid grid-cols-[100%] min-w-full w-full">
                        <div className="!transition-none flex flex-col col-start-1 row-start-1 overflow-hidden min-h-[150px] relative !bg-[#212121]">
                          <div className="min-h-[calc(100vh-111px)] transform translate-y-0">
                            <div className="mb-0 px-0 pt-0 pb-2 w-full">
                              <ul className="py-0 px-2 list-none bg-[#212121] flex flex-col m-0 relative select-none w-full">
                                {searchMessagesData &&
                                  searchMessagesData.map((message) => {
                                    const isSelected =
                                      activeChat?.id === message.conversationId;
                                    return (
                                      <a
                                        key={message.id}
                                        className={`!pl-[4.5rem] pr-3 !py-0 rounded-[10px] cursor-pointer overflow-hidden min-h-[4.5rem] flex flex-col justify-center relative ${
                                          !isSelected && 'hover:bg-[#2c2c2c]'
                                        } !whitespace-nowrap text-[#8774e1] no-underline ${
                                          isSelected && 'bg-[#8774e1]'
                                        }`}
                                      >
                                        <div className="mt-[0.125rem] h-[1.375rem] pointer-events-none relative order-1 flex items-center justify-between cursor-pointer select-none !whitespace-nowrap ">
                                          <div
                                            className={`leading-[1.375rem] mt-0 !text-[16px] !block flex-auto overflow-hidden overflow-ellipsis ${
                                              isSelected
                                                ? 'text-white'
                                                : 'text-[#aaa]'
                                            } pointer-events-none relative !whitespace-nowrap flex items-center`}
                                          >
                                            {message.content}
                                          </div>
                                        </div>
                                        <div className="h-[1.375rem] pointer-events-none relative flex items-center justify-between order-[0] cursor-pointer select-none !whitespace-nowrap ">
                                          <div className="leading-[1.375rem] !text-[16px] flex-auto overflow-hidden overflow-ellipsis relative !flex items-center pointer-events-none text-white break-words !whitespace-nowrap">
                                            <span className="font-medium overflow-hidden overflow-ellipsis whitespace-nowrap">
                                              {username}
                                            </span>
                                          </div>
                                        </div>
                                        <UserIcon
                                          username={username}
                                          isSelected={isSelected}
                                          style={{
                                            left: '0.5625rem',
                                            pointerEvents: 'none',
                                            flex: '0 0 auto',
                                            height: '3.375rem',
                                            width: '3.375rem',
                                            minHeight: '3.375rem',
                                            minWidth: '3.375rem',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            margin: '0',
                                            position: 'absolute',
                                            fontSize: '1.25rem',
                                            fontWeight: 500,
                                            lineHeight: '54px',
                                          }}
                                        />
                                      </a>
                                    );
                                  })}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#212121] h-full max-h-full relative left-0 top-0 w-full ">
                  <div className="bg-[#212121] absolute bottom-0 flex flex-col h-full left-0 overflow-hidden right-0 top-0 transform translate-y-0">
                    <div className="grid grid-cols-[100%] grid-rows-[100%] min-w-full w-full flex-auto">
                      <div
                        className="block absolute bottom-0 h-full left-0 max-h-full right-0 top-0 w-full bg-transparent !transition-none col-start-1 row-start-1 overflow-hidden"
                        style={{
                          transform: 'translateZ(0)',
                          overflowY: 'overlay',
                        }}
                      >
                        <div className="h-full">
                          <ul className="py-0 px-2 list-none bg-[#212121] flex flex-col m-0 relative w-full">
                            {conversations.length > 0
                              ? conversations.map((chat) => {
                                  const username = chat.user[0].username;
                                  const isOnline = chat.user[0].isOnline;
                                  const isSelected = activeChat?.id === chat.id;
                                  return (
                                    // Container
                                    <a
                                      key={chat.id}
                                      onClick={() => handleClick(chat.id)}
                                      className={`!pl-[4.5rem] pr-3 !py-0 rounded-[10px] cursor-pointer overflow-hidden min-h-[4.5rem] flex flex-col justify-center relative ${
                                        !isSelected && 'hover:bg-[#2c2c2c]'
                                      } !whitespace-nowrap text-[#8774e1] no-underline ${
                                        isSelected && 'bg-[#8774e1]'
                                      }`}
                                    >
                                      <div className="mt-[0.125rem] h-[1.375rem] pointer-events-none relative order-1 flex items-center justify-between cursor-pointer select-none !whitespace-nowrap ">
                                        <div
                                          className={`leading-[1.375rem] mt-0 !text-[16px] !block flex-auto overflow-hidden overflow-ellipsis ${
                                            isSelected
                                              ? 'text-white'
                                              : 'text-[#aaa]'
                                          } pointer-events-none relative !whitespace-nowrap flex items-center`}
                                        >
                                          {chat.isTyping ? (
                                            'typing'
                                          ) : chat.messages.length > 0 ? (
                                            <>{chat.messages.at(-1).content}</>
                                          ) : (
                                            'No messages'
                                          )}
                                        </div>
                                        {chat.unreadedMessagesCount > 0 && (
                                          <div
                                            className={`ml-2 ${
                                              isSelected
                                                ? 'bg-white text-[#8774e1]'
                                                : 'bg-[#8774e1] text-white'
                                            }  relative flex-[0_0_auto] !block rounded-[calc(1.375rem/2)] text-[0.875rem] font-medium h-[1.375rem] min-w-[1.375rem] py-0 px-[0.4375rem] text-center !leading-[1.375rem]`}
                                          >
                                            {chat.unreadedMessagesCount}
                                          </div>
                                        )}
                                      </div>
                                      <div className="h-[1.375rem] pointer-events-none relative flex items-center justify-between order-[0] cursor-pointer select-none !whitespace-nowrap ">
                                        <div className="leading-[1.375rem] !text-[16px] flex-auto overflow-hidden overflow-ellipsis relative !flex items-center pointer-events-none text-white break-words !whitespace-nowrap">
                                          <span className="font-medium overflow-hidden overflow-ellipsis whitespace-nowrap">
                                            {username}
                                          </span>
                                        </div>
                                        <div className="ml-2 mt-[-0.4375rem] !text-xs overflow-hidden overflow-ellipsis whitespace-nowrap pt-[1px] pb-0 px-0 pointer-events-none relative !flex-[0_0_auto] text-[#aaa] break-words">
                                          <span
                                            className={`mr-[0.125rem] ${
                                              isSelected
                                                ? 'text-white'
                                                : 'text-[#8774e1]'
                                            } inline-block text-[1.25rem] h-[1.25rem] leading-[1] mt-[-0.0625rem] relative align-middle w-[1.25rem] overflow-hidden overflow-ellipsis whitespace-nowrap`}
                                          >
                                            {chat.messages.length > 0 &&
                                              id ===
                                                chat.messages.at(-1).userId && (
                                                <>
                                                  {chat.messages.at(-1)
                                                    .haveSeen === false ? (
                                                    <BiCheck
                                                      style={{
                                                        color: `${
                                                          activeChat?.id !==
                                                          chat.id
                                                            ? '#8774e1'
                                                            : 'white'
                                                        }`,
                                                        width: '20px',
                                                        height: '20px',
                                                      }}
                                                    />
                                                  ) : (
                                                    <BiCheckDouble
                                                      style={{
                                                        color: `${
                                                          activeChat?.id !==
                                                          chat.id
                                                            ? '#8774e1'
                                                            : 'white'
                                                        }`,
                                                        width: '20px',
                                                        height: '20px',
                                                      }}
                                                    />
                                                  )}
                                                </>
                                              )}
                                          </span>
                                          <span
                                            className={`overflow-hidden overflow-ellipsis whitespace-nowrap ${
                                              isSelected && 'text-white'
                                            }`}
                                          >
                                            {`${new Date(
                                              chat.lastUpdated,
                                            ).getHours()}:${
                                              new Date(
                                                chat.lastUpdated,
                                              ).getMinutes() < 10
                                                ? '0'
                                                : ''
                                            }${new Date(
                                              chat.lastUpdated,
                                            ).getMinutes()}`}
                                          </span>
                                        </div>
                                      </div>
                                      <UserIcon
                                        username={username}
                                        isOnline={isOnline}
                                        status
                                        isSelected={isSelected}
                                        style={{
                                          left: '0.5625rem',
                                          pointerEvents: 'none',
                                          flex: '0 0 auto',
                                          height: '3.375rem',
                                          width: '3.375rem',
                                          minHeight: '3.375rem',
                                          minWidth: '3.375rem',
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          margin: '0',
                                          position: 'absolute',
                                          fontSize: '1.25rem',
                                          fontWeight: 500,
                                          lineHeight: '54px',
                                        }}
                                      />
                                    </a>
                                  );
                                })
                              : 'Peepeepoopoo'}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Add Contact Button */}
              {!isOpenAddUserModal && (
                <button
                  className="!transition-none right-5 rounded-[50%] h-[54px] leading-[54px] w-[54px] !cursor-pointer !font-normal overflow-visible flex justify-center items-center outline-none text-center z-[3] bg-[#8774e1] border-none bottom-5 text-white !shadow-none !p-0 m-0 !absolute hover:bg-[#6a52da]"
                  style={{
                    transform: 'translateZ(0)',
                    fontSize: '1.5rem',
                  }}
                  onClick={() => dispatch(setAddUserModal(!isOpenAddUserModal))}
                >
                  <HiPencil
                    style={{
                      visibility: 'visible !important',
                      height: '24px',
                      lineHeight: '24px',
                      position: 'absolute',
                    }}
                  />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBar;

{
  /* <a
key={chat.id}
onClick={() => handleClick(chat.id)}
className={`w-full min-h-[4.5rem] cursor-pointer flex flex-col justify-center items-center ${
  isSelected && 'bg-[#8774e1]'
} ${
  !isSelected &&
  'hover:bg-[rgba(51,144,236,.08)]'
} rounded-[10px] relative`}
> */
}
{
  /* User Icon */
}
{
  /* <div className="absolute left-2">
  <UserIcon
    chat={chat}
    isSelected={isSelected}
    username={chat.user[0].username}
    isOnline={chat.user[0].isOnline}
    status={true}
    style={{
      width: '3.375rem',
      minWidth: '3.375rem',
      height: '3.375rem',
      minHeight: '3.375rem',
      fontSize: '1.25rem',
    }}
  />
</div> */
}
{
  /* Right Section */
}
{
  /* <div className="flex flex-col truncate w-full pl-[4.5rem] pr-3"> */
}
{
  /* Name and Date */
}
{
  /* <div className="flex justify-between items-center h-[1.375rem]">
    <span className="font-semibold truncate text-white">
      {chat.user[0].username}
    </span> */
}
{
  /* Read Message and Date */
}
{
  /* <div className="flex items-center ml-2">
      {chat.messages.length > 0 &&
        id ===
          chat.messages.at(-1).userId && (
          <>
            {chat.messages.at(-1).haveSeen ===
            false ? (
              <BiCheck
                style={{
                  color: `${
                    activeChat?.id !== chat.id
                      ? '#8774e1'
                      : 'white'
                  }`,
                  width: '20px',
                  height: '20px',
                }}
              />
            ) : (
              <BiCheckDouble
                style={{
                  color: `${
                    activeChat?.id !== chat.id
                      ? '#8774e1'
                      : 'white'
                  }`,
                  width: '20px',
                  height: '20px',
                }}
              />
            )}
          </>
        )}
      <span
        className={`text-xs pt-[1px] truncate font-medium  ${
          isSelected
            ? 'text-white'
            : 'text-[#aaa]'
        }`}
      >{`${new Date(
        chat.lastUpdated,
      ).getHours()}:${
        new Date(
          chat.lastUpdated,
        ).getMinutes() < 10
          ? '0'
          : ''
      }${new Date(
        chat.lastUpdated,
      ).getMinutes()}`}</span>
    </div>
  </div> */
}
{
  /* Content and Unreaded Messages Count */
}
{
  /* <div
    className={`flex justify-between mt-[0.125rem] h-[1.375rem] text-[16px] ${
      isSelected
        ? 'text-white'
        : 'text-[#aaa]'
    }`}
  > */
}
{
  /* Content */
}
{
  /* {chat.isTyping ? (
      <p className="italic text-sm">
        is typing...
      </p>
    ) : chat.messages.length > 0 ? (
      <p className="text-sm truncate">
        {chat.messages.at(-1).content}
      </p>
    ) : (
      <p className="text-sm truncate">
        No messages
      </p>
    )} */
}
{
  /* Unreaded Messages Count */
}
{
  /* {chat.unreadedMessagesCount > 0 && (
      <span className="ml-2 bg-[#8774e1] text-center text-white text-[0.875rem] rounded-[0.6875rem] h-[1.375rem] min-w-[1.375rem] px-[0.4375rem] font-medium">
        {chat.unreadedMessagesCount}
      </span>
    )}
  </div>
</div>
</a> */
}
