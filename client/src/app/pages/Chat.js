import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { socket } from '../socket';
import { setActiveChat } from '../slices/chat.slice';

import ChatBar from '../components/ChatBar';
import ChatBody from '../components/ChatBody';
// import ChatFooter from '../components/ChatFooter';

const Chat = () => {
  const { chatList, activeChat } = useSelector((state) => state.chat);
  const { id, username } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log('render chat', chatList);

  useEffect(() => {
    socket.on('res', (data) => console.log('user', data));

    return () => {
      socket.off('res');
    };
  }, []);

  const click = () => {
    socket.emit('click', 'hello');
  };

  const handleClick = (chat) => {
    dispatch(setActiveChat(chat));
  };

  return (
    <>
      {/* <p>Im {chatList.isOnline ? 'online' : 'offline'}</p> */}
      <p>Chat</p>

      {chatList.id && (
        <div>
          <ChatBar
            conversations={chatList.conversations}
            handleClick={handleClick}
          />
          <ChatBody
            activeChat={activeChat}
            handleClick={handleClick}
            id={id}
            username={username}
          />
        </div>
      )}

      <button onClick={click}>Click</button>
    </>
  );
};

export default Chat;
