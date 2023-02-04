import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { socket } from '../socket';
import { setActiveChat } from '../slices/chat.slice';

import ChatBar from '../components/ChatBar';
import ChatBody from '../components/ChatBody';
import ChatProfile from '../components/ChatProfile';

const Chat = () => {
  const { chatList, activeChat } = useSelector((state) => state.chat);
  const { isOpenFriendProfile } = useSelector((state) => state.handler);
  const dispatch = useDispatch();

  console.log('render chatList', chatList);

  useEffect(() => {
    socket.on('res', (data) => console.log('user', data));

    return () => {
      socket.off('res');
    };
  }, []);

  const handleClick = (chat) => {
    dispatch(setActiveChat(chat));
  };

  return (
    <>
      <ChatBar
        conversations={chatList.conversations}
        handleClick={handleClick}
      />
      <ChatBody handleClick={handleClick} />
      <div
        className={`!flex flex-col w-[421px] absolute right-0 z-[3] h-full min-h-full max-h-full bg-[#181818] transform-gpu translate-x-[420px] translate-y-0`}
        style={{
          borderLeft: '1px solid #0f0f0f',
          overflow: 'initial',
          gridColumnStart: 1,
          boxShadow: '0 0.25rem 0.5rem 0.1rem rgb(0 0 0 / 20%)',
          transform: isOpenFriendProfile
            ? 'translateZ(0)'
            : 'translate3d(420px,0,0)',
        }}
      >
        {activeChat && <ChatProfile />}
      </div>
    </>
  );
};

export default Chat;
