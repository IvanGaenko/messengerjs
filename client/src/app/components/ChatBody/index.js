import { useSelector } from 'react-redux';

import Background from './Background';
import ChatBodyHeader from './ChatBodyHeader';
import ChatBodyBubbles from './ChatBodyBubbles';
import ChatBodyInput from './ChatBodyInput';

const ChatBody = ({ handleClick }) => {
  const { activeChat } = useSelector((state) => state.chat);

  return (
    <div
      className="w-full bg-[#e6ebee] !flex flex-col overflow-hidden relative h-full min-h-full max-h-full"
      style={{
        flex: 3,
        gridColumnStart: 1,
      }}
    >
      <div className="grid grid-cols-[100%] grid-rows-[100%] min-w-full w-full h-full">
        <div className="!transition-none bg-[#181818] !flex flex-col items-center w-full col-start-1 row-start-1 overflow-hidden">
          <Background />
          {activeChat && (
            <>
              <ChatBodyHeader handleClick={handleClick} />
              <ChatBodyBubbles />
              <ChatBodyInput />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBody;
