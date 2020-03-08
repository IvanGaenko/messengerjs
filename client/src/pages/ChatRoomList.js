// Imports
import React from 'react';
import { useSelector } from 'react-redux';

// Component
const ChatRoomList = () => {
  //State
  const { messages } = useSelector(state => state.chat);

  return (
    <div>
      {messages.map(t => {
        return (
          <div key={t.id}>
            <span>
              {t.author}: {t.message}
            </span>
            {/* <p>{t.createdAt}</p> */}
          </div>
        );
      })}
    </div>
  );
};

export default ChatRoomList;
