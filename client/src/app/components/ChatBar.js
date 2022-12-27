const ChatBar = ({ conversations, handleClick }) => {
  return (
    <div>
      {conversations.length > 0
        ? [...conversations]
            .sort((a, b) => {
              return (
                (b.messages[b.messages.length - 1].createdAt ||
                  b.userToConversation.createdAt) -
                (a.messages[a.messages.length - 1].createdAt ||
                  a.userToConversation.createdAt)
              );
            })
            .map((chat) => {
              return (
                <div key={chat.id} onClick={() => handleClick(chat.id)}>
                  <p>
                    {chat.users[0].username}
                    {chat.users[0].id}
                    {/* {': '} */}
                    {/* {chat.users[0].isOnline ? 'online' : 'offline'} */}
                    {chat.users[0].isOnline && ': online'}
                  </p>
                </div>
              );
            })
        : 'Peepeepoopoo'}
    </div>
  );
};

export default ChatBar;
