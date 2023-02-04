// import { useEffect, useState, useRef, createRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';

// import ChatFooter from './ChatFooter';
// import { timeAgo } from '../features/getFormattedDate';
// import { socket } from '../socket';
// import getFormattedMessages from '../features/getFormattedMessages';
// import { toggleFriendProfile } from '../slices/handler.slice';

// import {
//   // BiArrowBack,
//   // BiSearch,
//   BiCheck,
//   BiCheckDouble,
//   // BiTrashAlt,
// } from 'react-icons/bi';
// import {
//   BsThreeDotsVertical,
//   BsThreeDots,
//   BsCheckCircle,
// } from 'react-icons/bs';
// import UserIcon from '../common/UserIcon';

// const MONTH_NAMES = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December',
// ];

// let readReceiptTimeout = null;

// const ChatBody = ({ handleClick }) => {
const ChatBody = () => {
  // const { id } = useSelector((state) => state.user);
  // const { activeChat } = useSelector((state) => state.chat);
  // const dispatch = useDispatch();

  // const [toggleFriendMenu, setToggleFriendMenu] = useState(false);

  // const lastMessageRef = useRef(null);
  // const friendMenuRef = useRef();

  // let refs = [];
  // const latestRefs = useRef(refs);

  // let readReceiptIds = [];

  // const observer = new IntersectionObserver(
  //   (entries) => {
  //     for (let entry of entries) {
  //       if (entry.isIntersecting) {
  //         latestRefs.current = refs;
  //         const currentRef = latestRefs.current.find(
  //           (ref) => ref.messageId === Number(entry.target.id),
  //         );
  //         console.log('currentRef', currentRef);
  //         if (readReceiptTimeout === null) {
  //           readReceiptTimeout = setTimeout(() => {
  //             if (Object.keys(readReceiptIds).length > 0) {
  //               socket.emit('readReceiptResponse', {
  //                 readReceiptIds,
  //                 conversationId: activeChat.id,
  //                 friendId: activeChat.user[0].id,
  //               });
  //               console.log('sending ids');
  //             }

  //             clearTimeout(readReceiptTimeout);
  //             readReceiptTimeout = null;
  //             // readReceiptIds = {};
  //             readReceiptIds = [];

  //             console.log(
  //               'fired up! -----------------------------',
  //               readReceiptIds,
  //             );
  //           }, 500);
  //         }

  //         // readReceiptIds[currentRef.index] = Number(entry.target.id);
  //         readReceiptIds.push(Number(entry.target.id));
  //         observer.unobserve(entry.target);
  //         refs = refs.filter(
  //           (ref) => ref.messageId !== Number(entry.target.id),
  //         );
  //       }
  //     }
  //   },
  //   {
  //     threshold: 1,
  //   },
  // );
  console.log('observer created');

  // const newRef = ({ messageId }) => {
  //   const ref = createRef();
  //   refs.push({
  //     messageId,
  //     ref,
  //   });
  //   console.log('refs', refs);
  //   return ref;
  // };

  // useEffect(() => {
  //   console.log('message added');
  //   lastMessageRef.current?.scrollIntoView();
  //   // lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });

  //   refs.forEach((ref) => {
  //     observer.observe(ref.ref.current);
  //   });

  //   return () => {
  //     refs.forEach(
  //       (ref) => ref.ref.current && observer.unobserve(ref.ref.current),
  //     );

  //     clearTimeout(readReceiptTimeout);
  //     readReceiptTimeout = null;
  //   };
  // }, [activeChat.messages]);

  // useEffect(() => {
  //   let modalData = null;
  //   let globalMouseData = {
  //     x: 0,
  //     y: 0,
  //   };
  //   let modalTimeout = null;

  //   const handleGlobalMouseMove = (e) => {
  //     if (modalTimeout === null) {
  //       if (modalData === null && toggleFriendMenu) {
  //         modalData = friendMenuRef.current.getBoundingClientRect();
  //       }

  //       globalMouseData.x = e.clientX;
  //       globalMouseData.y = e.clientY;

  //       modalTimeout = setTimeout(() => {
  //         modalTimeout = null;
  //       }, 200);
  //     }

  //     if (
  //       globalMouseData.y > modalData.bottom + 100 ||
  //       globalMouseData.y < modalData.top - 100 ||
  //       globalMouseData.x > modalData.right + 100 ||
  //       globalMouseData.x < modalData.left - 100
  //     ) {
  //       toggleFriendMenu && setToggleFriendMenu(false);
  //     }
  //   };

  //   if (toggleFriendMenu) {
  //     window.addEventListener('mousemove', handleGlobalMouseMove);
  //   }

  //   return () => {
  //     if (toggleFriendMenu) {
  //       window.removeEventListener('mousemove', handleGlobalMouseMove);
  //     }
  //   };
  // }, [toggleFriendMenu]);

  // console.log('chat body refresh', activeChat);
  // console.log('activechat.messages', getFormattedMessages(activeChat.messages));
  // console.log('toggleFriendMenu', toggleFriendMenu);

  return (
    <>
      {/* Header */}
      {/* <div
        className="flex items-center bg-[#212121] flex-[0_0_auto] justify-between px-4 select-none mb-0 relative w-full z-[1] !cursor-pointer !max-h-14 !min-h-[3.5rem] text-white before:shadow-[0_1px_5px_-1px_rgba(0,0,0,0.21)] before:content-[' '] before:left-0 before:pointer-events-none before:absolute before:right-0 before:top-0 before:h-14"
        onClick={() => dispatch(toggleFriendProfile(true))}
      >
        <div className="flex items-center flex-auto h-14 justify-between max-h-14 max-w-full">

          <button
            className="transition-none flex-[0_0_auto] h-10 w-10 flex items-center bg-transparent border-none text-[#aaa] text-[1.5rem] justify-center leading-[1] p-2 relative text-center !rounded-[50%] cursor-pointer outline-none m-0 hover:bg-[hsla(0,0%,67%,.08)]"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(null);
            }}
          >
            <BiArrowBack />
          </button>

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
                    activeChat.user[0].isOnline
                      ? 'text-[#8774e1]'
                      : 'text-[#aaa]'
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
                <>
                  <div className="!max-w-none !fixed !w-auto -bottom-full cursor-default -left-full -right-full -top-full select-none z-[4]"></div>
                  <div
                    ref={friendMenuRef}
                    className="max-h-[calc(4.12px*100-4.375rem)] absolute z-[4] top-[calc(100%+7px)] transition-none mt-2 left-auto right-0 origin-top-right transform !scale-x-100 shadow-[0_0_10px_rgba(0_0_0_0.15)] backdrop-blur-[50px] bg-[rgba(33,33,33,0.75)] rounded-[10px] text-[1rem] min-w-[11.25rem] py-[0.3125rem] px-0 select-none !cursor-pointer !pointer-events-auto leading-[1] text-center"
                    style={{
                      overflowY: 'overlay',
                    }}
                  >
                    <div className="text-left flex items-center rounded-[0.3125rem] text-white text-[14px] font-medium h-8 leading-[18px] mx-[0.3125rem] py-1 px-3 relative transform scale-100 whitespace-nowrap !cursor-pointer !pointer-events-auto hover:bg-[rgba(171,171,171,0.08)]">
                      <BsCheckCircle
                        style={{
                          marginRight: '1.25rem',
                          marginTop: '0.125rem',
                          fontSize: '1.25rem',
                        }}
                      />
                      <span>Select Messages</span>
                    </div>
                    <div className="text-left flex items-center rounded-[0.3125rem] text-[#ff595a] text-[14px] font-medium h-8 leading-[18px] mx-[0.3125rem] py-1 px-3 relative transform scale-100 whitespace-nowrap !cursor-pointer !pointer-events-auto hover:bg-[rgba(171,171,171,0.08)]">
                      <BiTrashAlt
                        style={{
                          marginRight: '1.25rem',
                          marginTop: '0.125rem',
                          fontSize: '1.25rem',
                        }}
                      />
                      <span>Delete Chat</span>
                    </div>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div> */}
      {/* Body */}
      {/* <div className="!transition-none flex-auto relative transform-gpu translate-y-0 w-full">
        <div
          className="block h-auto absolute bottom-0 left-0 max-h-full overflow-x-hidden right-0 top-0 w-full"
          style={{
            transform: 'translateZ(0)',
            overflowY: 'overlay',
          }}
        >
          <div className="!transition-none flex flex-col justify-end my-0 mx-auto max-w-[728px] min-h-full py-0 px-[0.8125rem] transform translate-y-0 w-full after:content-[' '] after:h-[0.125rem]">
            {getFormattedMessages(activeChat.messages).map(
              (dateGroup, i, arr) => {
                const todayDate = new Date();
                const sameDate = dateGroup.day === todayDate.getDate();
                const sameMonth = dateGroup.month === todayDate.getMonth() + 1;
                const sameYear = dateGroup.year === todayDate.getFullYear();
                const isToday = sameDate && sameMonth && sameYear;
                const lastMessageId = arr
                  .at(-1)
                  .dayPayload.at(-1)
                  .minutePayload.at(-1).id;
                console.log('lastMessageId', lastMessageId);
                return (
                  <section key={dateGroup.id} className="relative block">
                    <div className="transition-none justify-center self-center font-medium opacity-[0.99999] pb-[0.375rem] pointer-events-none sticky top-[0.25rem] z-[2] max-w-[728px] flex flex-wrap mt-0 mx-auto mb-[0.125rem] select-none">
                      <div className="select-text cursor-pointer pointer-events-auto bg-transparent rounded-[0.875rem] shadow-none my-0 mx-auto max-w-full transition-none flex flex-col-reverse min-w-[56px] relative z-[2]">
                        <div className="items-center bg-[rgba(137,53,138,40%)] rounded-[0.875rem] text-white flex text-[15px] justify-center leading-[20px] py-[0.28125rem] px-[0.625rem] text-center select-none break-words">
                          {isToday ? (
                            'Today'
                          ) : (
                            <>
                              {MONTH_NAMES[dateGroup.month - 1]}{' '}
                              {dateGroup.day < 10 ? '0' : ''}
                              {dateGroup.day}{' '}
                              {dateGroup.year === new Date().getFullYear()
                                ? null
                                : dateGroup.year}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="h-1 top-0 absolute left-0 pointer-events-none right-0 invisible"></div>
                    {dateGroup.dayPayload.map((minuteGroup) => {
                      return (
                        <div key={minuteGroup.id} className="relative">
                          {minuteGroup.minutePayload.map((message, i) => {
                            const { hour, minutes, haveSeen } = message;
                            const isMine = message.userId === id ? true : false;
                            const isGroupFirst = i === 0;
                            const isGroupLast =
                              i === minuteGroup.minutePayload.length - 1;
                            const isLastMessage = message.id === lastMessageId;
                            return (
                              <div
                                ref={
                                  !isMine && haveSeen === false
                                    ? newRef({
                                        messageId: message.id,
                                      })
                                    : null
                                }
                                key={message.id}
                                id={message.id}
                                onContextMenu={() =>
                                  console.log(
                                    'context menu called on',
                                    message.id,
                                  )
                                }
                                className={`flex flex-wrap ${
                                  isMine && 'flex-row-reverse'
                                } mt-0 mx-auto mb-[0.125rem] relative select-none z-[1] aftet:block after:w-[200%] after:absolute after:left-[-50%]  after:content-[' '] after:z-[-1] ${
                                  isGroupFirst &&
                                  'after:top-[-0.25rem] after:bottom-[-0.0625rem]'
                                } ${
                                  isGroupLast &&
                                  `${
                                    isLastMessage ? 'mb-[0.0625rem]' : 'mb-2'
                                  } after:top-[-0.0625rem] after:bottom-[-0.25rem]`
                                }`}
                              >
                                <div className="max-w-[85%] flex flex-col">
                                  <div
                                    className={`select-text rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl transition-none shadow-[0_1px_2px_0_rgba(16,35,47,0.15)] flex flex-col-reverse max-w-full min-w-[56px] relative z-[2]  ${
                                      isMine
                                        ? `ml-auto bg-[#8774e1] ${
                                            isGroupFirst
                                              ? 'rounded-tr-xl'
                                              : 'rounded-tr-[6px]'
                                          } ${
                                            isGroupLast
                                              ? '!rounded-br-none'
                                              : 'rounded-br-[6px]'
                                          }`
                                        : `ml-0 bg-[#212121] ${
                                            isGroupFirst
                                              ? 'rounded-tl-xl'
                                              : 'rounded-tl-[6px]'
                                          } ${
                                            isGroupLast
                                              ? '!rounded-bl-none'
                                              : 'rounded-bl-[6px]'
                                          }`
                                    } `}
                                  >
                                    <div className="pt-[6px] max-w-[480px] text-white text-[16px] leading-[1.3125] pr-[0.5rem] pb-[0.375rem] pl-[0.625rem] relative whitespace-pre-wrap break-words">
                                      {message.content}
                                      <span
                                        className={`${
                                          isMine
                                            ? 'ml-[-4px] pr-[5px]'
                                            : '!ml-[-3px] !pr-[8px]'
                                        } cursor-pointer inline-flex float-right text-[12px] h-[12px] leading-[1] pointer-events-none select-none align-middle invisible whitespace-pre-wrap break-words`}
                                      >
                                        {`${hour < 10 ? '0' : ''}${hour}:${
                                          minutes < 10 ? '0' : ''
                                        }${minutes}`}
                                        {isMine &&
                                          (haveSeen ? (
                                            <BiCheckDouble
                                              style={{
                                                color: 'white',
                                              }}
                                              size="20px"
                                            />
                                          ) : (
                                            <BiCheck
                                              style={{
                                                color: 'white',
                                              }}
                                              size="20px"
                                            />
                                          ))}

                                        <div
                                          className={`${
                                            isMine
                                              ? 'ml-[-4px] pr-[5px] bottom-[4px] text-white'
                                              : '!mb-[4px] !pr-[8px] !bottom-0 text-[#aaa]'
                                          } absolute visible flex items-center h-[12px] leading-[1] pr-[5px] pointer-events-auto right-0 whitespace-nowrap`}
                                        >
                                          <span className="opacity-60">{`${
                                            hour < 10 ? '0' : ''
                                          }${hour}:${
                                            minutes < 10 ? '0' : ''
                                          }${minutes}`}</span>
                                          {isMine &&
                                            (haveSeen ? (
                                              <BiCheckDouble
                                                style={{
                                                  color: 'white',
                                                }}
                                                size="20px"
                                              />
                                            ) : (
                                              <BiCheck
                                                style={{
                                                  color: 'white',
                                                }}
                                                size="20px"
                                              />
                                            ))}
                                        </div>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </section>
                );
              },
            )}
          </div>
        </div>
      </div> */}
      {/* Input */}
      {/* <ChatFooter
        id={id}
        conversationId={activeChat.id}
        friendId={activeChat.user[0].id}
      /> */}
    </>
  );
};

export default ChatBody;

// export function generateTail() {
//   const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//   svg.setAttributeNS(null, 'viewBox', '0 0 11 20');
//   svg.setAttributeNS(null, 'width', '11');
//   svg.setAttributeNS(null, 'height', '20');
//   svg.classList.add('bubble-tail');

//   const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
//   use.setAttributeNS(null, 'href', '#message-tail-filled');

//   svg.append(use);

//   return svg;
// }

// console.log(generateTail());
