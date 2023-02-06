import { useEffect, createRef, useRef } from 'react';
import { useSelector } from 'react-redux';

// import getFormattedMessages from '../../features/getFormattedMessages';
import { BiCheck, BiCheckDouble } from 'react-icons/bi';

import { socket } from '../../socket';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

let readReceiptTimeout = null;

const ChatBodyBubbles = () => {
  const { id } = useSelector((state) => state.user);
  const { activeChat } = useSelector((state) => state.chat);

  let refs = [];
  const latestRefs = useRef(refs);
  const lastMessageRef = useRef(null);

  let readReceiptIds = [];

  const observer = new IntersectionObserver(
    (entries) => {
      for (let entry of entries) {
        if (entry.isIntersecting) {
          latestRefs.current = refs;
          const currentRef = latestRefs.current.find(
            (ref) => ref.messageId === Number(entry.target.id),
          );
          console.log('currentRef', currentRef);
          if (readReceiptTimeout === null) {
            readReceiptTimeout = setTimeout(() => {
              if (Object.keys(readReceiptIds).length > 0) {
                socket.emit('readReceiptResponse', {
                  readReceiptIds,
                  conversationId: activeChat.id,
                  friendId: activeChat.user[0].id,
                });
                console.log('sending ids');
              }

              clearTimeout(readReceiptTimeout);
              readReceiptTimeout = null;
              readReceiptIds = [];

              console.log(
                'fired up! -----------------------------',
                readReceiptIds,
              );
            }, 500);
          }

          // readReceiptIds.push(Number(entry.target.id));
          readReceiptIds.push({
            dayId: currentRef.dayId,
            messageId: currentRef.messageId,
          });

          observer.unobserve(entry.target);

          refs = refs.filter(
            (ref) => ref.messageId !== Number(entry.target.id),
          );
        }
      }
    },
    {
      threshold: 1,
    },
  );

  const newRef = ({ dayId, messageId }) => {
    const ref = createRef();
    refs.push({
      dayId,
      messageId,
      ref,
    });
    console.log('refs', refs);
    return ref;
  };

  useEffect(() => {
    console.log('message added');
    lastMessageRef.current?.scrollIntoView();
    // lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });

    refs.forEach((ref) => {
      observer.observe(ref.ref.current);
    });

    return () => {
      refs.forEach(
        (ref) => ref.ref.current && observer.unobserve(ref.ref.current),
      );

      clearTimeout(readReceiptTimeout);
      readReceiptTimeout = null;
    };
  }, [activeChat.messageByDay]);

  return (
    <div className="!transition-none flex-auto relative transform-gpu translate-y-0 w-full">
      <div
        className="block h-auto absolute bottom-0 left-0 max-h-full overflow-x-hidden right-0 top-0 w-full"
        style={{
          transform: 'translateZ(0)',
          overflowY: 'overlay',
        }}
      >
        <div className="!transition-none flex flex-col justify-end my-0 mx-auto max-w-[728px] min-h-full py-0 px-[0.8125rem] transform translate-y-0 w-full after:content-[' '] after:h-[0.125rem]">
          {/* {getFormattedMessages(activeChat.messages).map( */}
          {activeChat.messageByDay.map((messageByDay, i, arr) => {
            const todayDate = new Date();
            const currentDay = new Date(messageByDay.dayId * 100000);
            // console.log('currentDay', messageByDay.dayId);
            const currentDate = currentDay.getDate();
            const currentMonth = MONTH_NAMES[currentDay.getMonth()];
            const currentYear = currentDay.getFullYear();
            const sameDate = currentDate === todayDate.getDate();
            const sameMonth =
              currentMonth === MONTH_NAMES[todayDate.getMonth()];
            const sameYear = currentYear === todayDate.getFullYear();
            const isToday = sameDate && sameMonth && sameYear;
            const lastMessageId = arr.at(-1).messages.at(-1).id;
            console.log('lastMessageId', lastMessageId);
            return (
              <section key={messageByDay.id} className="relative block">
                <div className="transition-none justify-center self-center font-medium opacity-[0.99999] pb-[0.375rem] pointer-events-none sticky top-[0.25rem] z-[2] max-w-[728px] flex flex-wrap mt-0 mx-auto mb-[0.125rem] select-none">
                  <div className="select-text cursor-pointer pointer-events-auto bg-transparent rounded-[0.875rem] shadow-none my-0 mx-auto max-w-full transition-none flex flex-col-reverse min-w-[56px] relative z-[2]">
                    <div className="items-center bg-[rgba(137,53,138,40%)] rounded-[0.875rem] text-white flex text-[15px] justify-center leading-[20px] py-[0.28125rem] px-[0.625rem] text-center select-none break-words">
                      {isToday ? (
                        'Today'
                      ) : (
                        <>
                          {currentMonth} {currentDate < 10 ? '0' : ''}
                          {currentDate} {sameYear ? null : currentYear}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="h-1 top-0 absolute left-0 pointer-events-none right-0 invisible"></div>
                {messageByDay.messages.map((message) => {
                  const { haveSeen } = message;
                  const currentTime = new Date(Number(message.timestamp));
                  // console.log('currentTime', currentTime);
                  const currentHour = currentTime.getHours();
                  const currentMinute = currentTime.getMinutes();
                  const isMine = message.userId === id ? true : false;
                  const isGroupFirst = false;
                  const isGroupLast = false;
                  const firstUnreadMessage = false;
                  return (
                    <div key={message.id} className="relative">
                      <div
                        ref={
                          !isMine && haveSeen === false
                            ? newRef({
                                dayId: messageByDay.dayId,
                                messageId: message.id,
                              })
                            : null
                        }
                        key={message.id}
                        id={message.id}
                        data-unread-message="Unread messages"
                        onContextMenu={() =>
                          console.log('context menu called on', message.id)
                        }
                        className={`flex flex-wrap ${
                          isMine && 'flex-row-reverse'
                        } mt-0 mx-auto mb-[0.125rem] relative select-none z-[1] aftet:block after:w-[200%] after:absolute after:left-[-50%]  after:content-[' '] after:z-[-1]
                        ${
                          isGroupFirst &&
                          'after:top-[-0.25rem] after:bottom-[-0.0625rem]'
                        } ${
                          isGroupLast &&
                          `!mb-2 after:top-[-0.0625rem] after:bottom-[-0.25rem]`
                        }
                        ${
                          firstUnreadMessage &&
                          'before:bg-[#212121] before:text-[#8774e1] before:content-[attr(data-unread-message)] before:text-[15px] before:font-medium before:h-[30px] before:leading-[2.1] before:mb-1 before:ml-[-50%] before:mr-[-50%] before:relative before:text-center before:z-[2] before:block before:w-[200%]'
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
                                {`${
                                  currentHour < 10 ? '0' : ''
                                }${currentHour}:${
                                  currentMinute < 10 ? '0' : ''
                                }${currentMinute}`}
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
                                    currentHour < 10 ? '0' : ''
                                  }${currentHour}:${
                                    currentMinute < 10 ? '0' : ''
                                  }${currentMinute}`}</span>
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
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
        <div className="w-full" ref={lastMessageRef} />
      </div>
    </div>
  );
};

export default ChatBodyBubbles;
