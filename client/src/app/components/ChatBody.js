import ChatFooter from './ChatFooter';
import { timeAgo } from '../features/getFormattedDate';

const ChatBody = ({ activeChat, handleClick, id, username }) => {
  console.log('chat body refresh', activeChat);
  return (
    <div>
      {activeChat && (
        <div>
          <p>{activeChat.users[0].username}</p>
          <p>
            {activeChat.users[0].isOnline
              ? 'online'
              : `was online ${timeAgo(activeChat.users[0].lastActivity)}`}
          </p>
          <button onClick={() => handleClick(null)}>Close</button>
          {activeChat.messages.map((message) => {
            const { userId, content } = message;
            return (
              <div key={message.id}>
                {userId === id ? username : activeChat.users[0].username}
                {message.id}
                {': '}
                {content}
              </div>
            );
          })}
          <ChatFooter />
        </div>
      )}
    </div>
  );
};

export default ChatBody;
