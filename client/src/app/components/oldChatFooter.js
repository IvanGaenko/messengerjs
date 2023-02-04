import { useEffect, useState, useRef } from 'react';

import { IoSendSharp } from 'react-icons/io5';
import { BsArrowDownShort } from 'react-icons/bs';
import { socket } from '../socket';

let typingTimeout = null;
const initialValue = '';

const ChatFooter = ({ id, conversationId, friendId }) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    // console.log('work in effect inputRef', inputRef);
    if (inputValue) {
      inputRef.current.textContent = inputValue;
    }
  }, [inputValue]);

  const onSendMessage = () => {
    // console.log('sending', inputRef.current.textContent);
    socket.emit('clientResponse', {
      userId: id,
      friendId,
      conversationId,
      content: inputValue,
      haveSeen: false,
    });
    setInputValue(initialValue);
    inputRef.current.textContent = initialValue;
  };

  const onTypingHandler = () => {
    if (typingTimeout === null) {
      socket.emit('onTyping', {
        userId: id,
        friendId,
        conversationId,
      });

      typingTimeout = setTimeout(() => {
        typingTimeout = null;
      }, 1 * 1000);
    }
  };

  const handleChange = (val) => {
    setInputValue(val);
    onTypingHandler();
  };
  // console.log('inputValue', inputValue);

  return (
    <div className="!transition-none flex flex-[0_0_auto] flex-col max-w-full pt-1 relative transform-gpu translate-y-0 w-full">
      <div className="flex items-end flex-[0_0_auto] justify-center my-0 mx-auto max-w-[728px] pt-0 px-[0.8125rem] pb-2 relative w-full">
        <div className="flex w-full">
          <div className="rounded-br-none transform translate-x-0 scale-100 flex items-center rounded-l-[1rem] rounded-tr-[1rem] flex-[0_0_auto] flex-col justify-center max-h-[30rem] max-w-[calc(100%-2.875rem - 0.5rem)] min-h-[2.875rem] relative w-[calc(100%-2.875rem-0.5rem)] z-[3] before:absolute before:bg-[#212121] before:rounded-l-[1rem] before:rounded-tr-[1rem] before:rounded-br-none before:bottom-0 before:content-[' '] before:shadow-[0_1px_8px_1px_rgba(0,0,0,0.12)] before:left-0 before:opacity-100 before:right-0 before:top-0">
            <div className="items-end min-h-[2.875rem] opacity-100 bg-[#212121] rounded-[50%] flex justify-between py-[1px] px-[0.25rem] relative w-full">
              <div className="flex items-center self-center flex-auto max-h-[30rem] min-h-[calc(2.875rem - 1px*2)] overflow-hidden relative w-[1%]">
                <div
                  ref={inputRef}
                  contentEditable
                  suppressContentEditableWarning
                  data-placeholder="Message"
                  onInput={(e) =>
                    e.key !== 'Enter' && handleChange(e.target.textContent)
                  }
                  onPaste={(e) =>
                    e.key !== 'Enter' && handleChange(e.target.textContent)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onSendMessage();
                    }
                  }}
                  className="duration-[181ms] h-[37px] relative bg-none border-none text-[16px] leading-[1.3125] mt-[-1px] max-h-[27.5rem] outline-none py-2 px-[0.5625rem] resize-none w-full cursor-text select-text whitespace-pre-wrap caret-[#8774e1] text-white bottom-0 left-0 overflow-x-hidden right-0 top-0 before:empty:opacity-100 before:opacity-0 before:text-[#a2acb4] before:content-[attr(data-placeholder)] before:block before:pointer-events-none before:absolute scrollbar-hide"
                  style={{
                    transform: 'translateZ(0)',
                    height: 'auto',
                    overflowY: 'overlay',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <button className="!transition-none right-[0.8125rem] h-[2.875rem] w-[2.875rem] bottom-[calc(2.875rem + 0.5rem + 10px)] overflow-visible z-[2] flex items-center rounded-[50%] text-[#aaa] text-[1.5rem] justify-center !bg-[#212121] !shadow-[0_1px_8px_1px_rgba(0,0,0,0.12)] cursor-pointer opacity-100 !transform-none border-none outline-none text-center !p-0 !absolute bg-none m-0 font-normal leading-[1] invisible hover:bg-[hsla(0,0%,67%,.08)]">
          <BsArrowDownShort />
        </button>
        <div className="right-[0.8125rem] flex absolute items-center bottom-0 justify-center pb-2 ">
          <button
            className="transition-none text-[1.5rem] leading-[1.5rem] z-[3] !bg-[#8774e1] !text-white shadow-[0_1px_8px_1px_rgba(0,0,0,0.12)] h-[2.875rem] w-[2.875rem] overflow-hidden relative select-none flex items-center border-none justify-center p-2 text-center !rounded-[50%] bg-none cursor-pointer outline-none hover:!bg-[#6a52da]"
            onClick={onSendMessage}
          >
            <span className="h-[24px] leading-[24px] absolute text-[1.5rem] text-white select-none text-center cursor-pointer">
              <IoSendSharp />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatFooter;

// {/* <div className="w-full max-w-full pt-1 flex">
// <div className="w-full max-w-[728px] flex px-[0.8125rem] pb-[0.5rem]">
//   <div className="w-[calc(100%-2.875rem-0.5rem)] max-w-[calc(100%-2.875rem-0.5rem)] flex justify-center items-center min-h-[2.875rem] max-h-[30rem] relative rounded-2xl rounded-br-none px-[1px] py-1">
//     <div
//       contentEditable
//       suppressContentEditableWarning
//       className={`w-full max-w-full bg-[#212121] min-h-[2.875rem] mt-[-1px] px-[0.5625rem] py-[0.5rem] text-white outline-none break-words whitespace-pre-wrap cursor-text before:empty:content-[attr(data-placeholder)] before:text-[#a2acb4] before:font-base before:block rounded-2xl rounded-br-none border-none`}
//       data-placeholder="Message"
//       ref={ref}
//       // onInput={(e) => {
//       //   console.log('e', e);
//       //   handleChange(e.target.innerHTML);
//       //   onTypingHandler();
//       // }}
//       onInput={onTypingHandler}
//     >
//       {initialValue}
//     </div>
//     {/* <div className="absolute flex justify-center items-center pb-[0.5rem] w-[2.85rem] h-[2.85rem] bottom-0 right-[0.8125rem]">
//       <button
//         type="submit"
//         className="cursor-pointer bg-[#8774e1] text-white w-[2.875rem] h-[2.875rem] rounded-[50%] flex justify-center items-center"
//         onClick={onSendMessage}
//       >
//         <IoSendSharp size="24px" />
//       </button>
//     </div> */}
//   </div>
// </div>
// </div> */}
