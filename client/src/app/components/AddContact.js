import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { setAddUserModal } from '../slices/handler.slice';

import { MdClose } from 'react-icons/md';
import UserIcon from '../common/UserIcon';

const initialValue = '';

const AddContact = () => {
  const [inputUsernameFocus, setInputUsernameFocus] = useState(false);
  const [inputUsernameValue, setInputUsernameValue] = useState(initialValue);
  const dispatch = useDispatch();

  return (
    <div className="!fixed flex bg-[rgba(0,0,0,.3)] bottom-0 shadow-none left-0 m-0 max-w-[none] overflow-auto p-[1.875rem] right-0 top-0 z-[4]">
      <div
        className="flex bg-[#212121] rounded-[10px] flex-col m-auto overflow-hidden relative max-h-full w-[420px] max-w-[420px] px-[20px] pt-[12px] pb-[32.5px] transform-gpu translate-x-0"
        style={{
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Header */}
        <div className="flex items-center flex-[0_0_auto] flex-wrap justify-between mb-[9px] relative p-0">
          <span
            className="bg-none cursor-pointer outline-none !rounded-[50%] flex items-center bg-transparent border-none text-[#aaa] justify-center p-2 relative text-center flex-[0_0_auto] z-[3] text-2xl leading-[1] ml-[-4px] mr-0 mt-[-1px] mb-0 hover:bg-[hsla(0,0%,67%,.08)]"
            onClick={() => dispatch(setAddUserModal(false))}
          >
            <MdClose />
          </span>
          <div className="flex-1 text-xl font-medium leading-[1]  m-0 pl-6 pr-4">
            Add Contact
          </div>
          <button
            className={`outline-none m-0 border-none font-medium overflow-hidden text-center bg-[#8774e1] text-white relative ${
              inputUsernameValue.trim().length > 0
                ? 'opacity-100'
                : 'opacity-30'
            } rounded-[10px] text-[14px] h-9 leading-9 py-0 px-[1.375rem] uppercase w-auto ${
              inputUsernameValue.trim().length > 0 && 'hover:bg-[#6a52da]'
            }`}
            disabled={!inputUsernameValue.trim().length > 0}
            onClick={() =>
              console.log('search new friend with data', inputUsernameValue)
            }
          >
            Add
          </button>
        </div>
        {/* Name Fields */}
        <div className="flex flex-col mt-4 pl-[70px] relative">
          {/* Username Field */}
          <div className="relative flex-[0_0_auto] w-full">
            <div
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setInputUsernameValue(e.target.innerHTML)}
              onClick={() => setInputUsernameFocus(true)}
              onBlur={() => setInputUsernameFocus(false)}
              className="border-[1px] border-solid border-[#2f2f2f] box-border leading-[1.3125] min-h-[54px] py-[calc(1rem-1px)] px-[calc(1rem-1px)] relative w-full z-[1] bg-transparent caret-[#8774e1] text-white cursor-text outline-none whitespace-pre-wrap rounded-[10px] text-[1rem] hover:border-[#8774e1] focus:border-[#8774e1] mt-0"
              style={{
                userSelect: 'text',
              }}
            ></div>
            <div
              className={`border-[2px] border-solid border-[#8774e1] rounded-[10px] absolute bottom-0 left-0 ${
                inputUsernameFocus ? 'opacity-100' : 'opacity-0'
              } pointer-events-none right-0 top-0 z-[1]`}
            ></div>
            <label
              className={`bg-[#212121] text-[#9e9e9e] h-6 mt-[calc((54px-1.5rem)/2)] pointer-events-none absolute right-auto top-0 whitespace-nowrap z-[2] left-4 hover:text-[#8774e1] ${
                inputUsernameFocus || inputUsernameValue
                  ? 'opacity-100 px-[0.3125rem] transform translate-x-[-0.1875rem] translate-y-[calc(calc(54px/-2)+0.0625rem)] scale-75 font-medium'
                  : 'transform translate-x-0 translate-y-0'
              } ${inputUsernameFocus && 'text-[#8774e1]'}`}
              style={{
                transformOrigin: 'left center',
                userSelect: 'none',
              }}
            >
              User name (required)
            </label>
          </div>
          <UserIcon
            username={inputUsernameValue}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              height: '50px',
              width: '50px',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AddContact;
