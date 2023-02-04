import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import EditUserProfile from './EditUserProfile';
import Settings from './Settings';
import {
  addMessage,
  typingStatus,
  updateReceiptStatus,
} from '../../slices/chat.slice';
import { setAddUserModal } from '../../slices/handler.slice';

import { MdClose } from 'react-icons/md';
import { HiPencil } from 'react-icons/hi';
import { MdOutlineDarkMode } from 'react-icons/md';
import { BiCheck, BiCheckDouble, BiSearch } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import UserIcon from '../../common/UserIcon';

import { socket } from '../../socket';

let typingTimeout = null;

const ChatBar = ({ conversations, handleClick }) => {
  const { id, username } = useSelector((state) => state.user);
  const { activeChat, searchMessagesData } = useSelector((state) => state.chat);
  const { isOpenAddUserModal } = useSelector((state) => state.handler);

  const [searchInputFocus, setSearchInputFocus] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchInputMode, setSearchInputMode] = useState(false);

  const [toggleMainMenu, setToggleMainMenu] = useState(false);
  const [toggleLogoutMenu, setToggleLogoutMenu] = useState(false);
  const [toggleSettings, setToggleSettings] = useState(false);
  const [toggleEditProfile, setToggleEditProfile] = useState(false);
  const [toggleDarkMode, setToggleDarkMode] = useState(false);

  const dispatch = useDispatch();

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
            <EditUserProfile setToggleEditProfile={setToggleEditProfile} />
          ) : (
            <Settings
              toggleLogoutMenu={toggleLogoutMenu}
              logoutMenuRef={logoutMenuRef}
              setToggleSettings={setToggleSettings}
              setToggleEditProfile={setToggleEditProfile}
              setToggleLogoutMenu={setToggleLogoutMenu}
            />
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
