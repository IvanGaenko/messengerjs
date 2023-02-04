<div className="flex flex-col h-full w-full">
  {/* Header */}
  <header className="flex justify-between items-center h-14 m-h-14 px-4 py-1 text-white font-medium bg-[#212121] w-full shadow-md">
    <div className="flex items-center">
      <button
        onClick={() => handleClick(null)}
        className="p-2 w-10 h-10 opacity-80"
      >
        <BiArrowBack style={{ width: '100%', height: '100%' }} />
      </button>
      <div className="pl-1">
        <UserIcon chat={activeChat} status={false} />
      </div>
      <div className="flex flex-col items-start pl-[1.125rem] max-w-full overflow-hidden">
        <p className="font-semibold">{activeChat.user[0].username}</p>
        <p
          className={`text-sm text-[#aaa] truncate mt-[1px] flex items-center ${
            activeChat.user[0].isOnline && 'text-[#8774e1]'
          } ${activeChat.isTyping && 'italic'}`}
        >
          {activeChat.isTyping && (
            <BsThreeDots style={{ marginRight: '5px' }} />
          )}
          {activeChat.isTyping
            ? 'typing'
            : activeChat.user[0].isOnline
            ? 'online'
            : `last seen ${timeAgo(activeChat.user[0].lastActivity)}`}
        </p>
      </div>
    </div>
    <div>
      <button className="p-2 w-10 h-10 opacity-80 ml-2">
        <BiSearch style={{ width: '100%', height: '100%' }} />
      </button>
      <button className="p-2 w-10 h-10 opacity-80 ml-2">
        <BsThreeDotsVertical style={{ width: '100%', height: '100%' }} />
      </button>
    </div>
  </header>

  {/* Body */}
  <main
    ref={containerRef}
    className="flex flex-col flex-1 px-[0.8125rem] bg-[#181818] overflow-y-auto relative"
  >
    {activeChat.messages.map((message, i) => {
      const { userId, content, haveSeen } = message;
      const msgYear = new Date(message.createdAt).getFullYear();
      const msgMonth = new Date(message.createdAt).getMonth() + 1;
      const msgDay = new Date(message.createdAt).getDate();

      const prevMsgYear =
        i === 0
          ? 0
          : new Date(activeChat.messages[i - 1].createdAt).getFullYear();
      const prevMsgMonth =
        i === 0
          ? 0
          : new Date(activeChat.messages[i - 1].createdAt).getMonth() + 1;
      const prevMsgDay =
        i === 0 ? 0 : new Date(activeChat.messages[i - 1].createdAt).getDate();

      const msgHours = new Date(message.createdAt).getHours();
      const msgMinutes = new Date(message.createdAt).getMinutes();

      const sameYear = new Date().getFullYear() === msgYear;
      const sameMonth = new Date().getMonth() + 1 === msgMonth;
      const sameDay = new Date().getDate() === msgDay;

      const isMine = userId === id ? true : false;

      const isSameDateAsToday = sameYear && sameMonth && sameDay;
      const isSamePrevDate =
        msgYear === prevMsgYear &&
        msgMonth === prevMsgMonth &&
        msgDay === prevMsgDay;

      const isLastInRow =
        activeChat.messages[i + 1] === undefined ||
        userId !== activeChat.messages[i + 1]?.userId;
      const isFirstInRow =
        activeChat.messages[i - 1] === undefined ||
        userId !== activeChat.messages[i - 1]?.userId;
      return (
        // Message Container
        <div
          key={message.id}
          className="first:mt-auto w-full flex flex-col items-center"
          ref={
            !isMine && message.haveSeen === false
              ? newRef({ messageId: message.id, index: i })
              : null
          }
          id={message.id}
        >
          {/* New date header */}
          {!isSamePrevDate && isSameDateAsToday ? (
            <div className="text-[15px] bg-[#89358a] leading-5 font-medium px-[0.625rem] py-[0.28125rem] rounded-xl bg-opacity-40 my-1 text-white">
              Today
            </div>
          ) : !isSamePrevDate ? (
            <div className="text-[15px] bg-[#89358a] leading-5 font-medium px-[0.625rem] py-[0.28125rem] rounded-xl bg-opacity-40 my-1 text-white">
              {msgDay < 10 ? '0' : ''}
              {msgDay} {MONTH_NAMES[msgMonth - 1]}{' '}
              {msgYear === new Date().getFullYear() ? null : msgYear}
            </div>
          ) : null}

          {/* Message */}
          <div
            className={`bg-[#8774e1] w-max min-w-[56px] max-w-md font-medium pt-[6px] pr-[0.625rem] pb-[0.375rem] pl-2 my-1 shadow-md relative ${
              isMine
                ? `self-end rounded-tl-xl rounded-bl-xl rounded-br-md pr-2 pl-[0.625rem] ${
                    isLastInRow && 'rounded-br-[0px]'
                  } ${isFirstInRow ? 'rounded-tr-xl' : 'rounded-tr-md'}`
                : `self-start rounded-tr-xl rounded-bl-md rounded-br-xl bg-[#212121] ${
                    isLastInRow && 'rounded-bl-[0px]'
                  } ${isFirstInRow ? 'rounded-tl-xl' : 'rounded-tl-md'}`
            }`}
          >
            {/* Content */}
            <span className="text-white font-medium leading-snug w-full break-words whitespace-pre-wrap">
              {content}
            </span>
            {/* Time and haveSeen Container */}
            <span
              className={`float-right align-middle inline-flex pr-2 -ml-1 text-xs invisible ${
                !isMine && 'pr-[8px]'
              }`}
            >
              {/* Time */}
              <span className="self-end font-medium">
                {`${msgHours < 10 ? '0' : ''}${msgHours}:${
                  msgMinutes < 10 ? '0' : ''
                }${msgMinutes}`}
              </span>
              {/* haveSeen */}
              {isMine && (
                <div className="self-end">
                  {haveSeen === false ? (
                    <BiCheck
                      style={{
                        color: 'white',
                        width: '20px',
                        height: '20px',
                      }}
                    />
                  ) : (
                    <BiCheckDouble
                      style={{
                        color: 'white',
                        width: '20px',
                        height: '20px',
                      }}
                    />
                  )}
                </div>
              )}
              {/* Visible Time and haveSeen */}
              <div className="absolute visible flex items-center bottom-0 text-xs right-0 mb-1 pr-2">
                <span
                  className={`self-end font-medium ${
                    isMine ? 'text-white opacity-60' : 'text-[#aaa]'
                  }`}
                >
                  {`${msgHours < 10 ? '0' : ''}${msgHours}:${
                    msgMinutes < 10 ? '0' : ''
                  }${msgMinutes}`}
                </span>
                {isMine && (
                  <div className="self-end">
                    {haveSeen === false ? (
                      <BiCheck
                        style={{
                          color: 'white',
                          width: '20px',
                          height: '20px',
                        }}
                      />
                    ) : (
                      <BiCheckDouble
                        style={{
                          color: 'white',
                          width: '20px',
                          height: '20px',
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </span>
          </div>
          {/* <svg
          viewBox="0 0 11 20"
          width="11"
          height="20"
          class="bg-red-200 block h-5 w-3"
        >
          <use href="#message-tail-filled"></use>
        </svg> */}
        </div>
      );
    })}
    {/* Typing Status */}
    {/* <p
    className={`ml-2 mb-2 text-xs min-h-[1rem] italic ${
      activeChat.messages.length > 0 ? 'mt-0' : 'mt-auto'
    }`}
  >
    {activeChat.isTyping && `${activeChat.user[0].username} is typing...`}
  </p> */}
    <div ref={lastMessageRef} />
  </main>

  <ChatFooter
    id={id}
    conversationId={activeChat.id}
    friendId={activeChat.user[0].id}
  />
</div>;
