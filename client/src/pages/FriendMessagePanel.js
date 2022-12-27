// Imports
import React from 'react';
import { Link } from 'react-router-dom';

// App Imports
import routes from '../setup/routes';
import UnreadMessageCount from './UnreadMessageCount';

// Component
const FriendMessagePanel = (props) => {
  // State
  const { rooms } = props;

  return (
    <div>
      {rooms.map((room) => {
        return (
          <div key={room.id} style={{ padding: '10px' }}>
            <Link
              to={{
                pathname: `${routes.chat.path}/${room.id}`,
              }}
            >
              <div>{room.name}</div>
            </Link>
            <span>
              <UnreadMessageCount room={room} />
            </span>

            <div>
              {room.rawMessages.length === 0
                ? room.oldMessages[room.oldMessages.length - 1].author
                : room.rawMessages[room.rawMessages.length - 1].author}
              :
              {room.rawMessages.length === 0
                ? room.oldMessages[room.oldMessages.length - 1].message
                : room.rawMessages[room.rawMessages.length - 1].message}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FriendMessagePanel;
