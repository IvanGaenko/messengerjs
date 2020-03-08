// Imports
import React from 'react';
import { useSelector } from 'react-redux';

// App Imports
import EditMessage from './EditMessage';

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
            <EditMessage id={t.id} author={t.author} />
          </div>
        );
      })}
    </div>
  );
};

export default ChatRoomList;
