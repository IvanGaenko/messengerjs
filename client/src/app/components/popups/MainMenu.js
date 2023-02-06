import { useState } from 'react';

import { MdOutlineDarkMode } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';

const MainMenu = ({ mainMenuRef, setToggleSettings }) => {
  const [toggleDarkMode, setToggleDarkMode] = useState(false);
  return (
    <>
      <div className="!w-auto !fixed !max-w-none -bottom-full cursor-default -left-full -right-full -top-full select-none z-[4]"></div>
      <div
        ref={mainMenuRef}
        className="max-h-[calc(4.32px*100 - 3.75rem)] min-w-[260px] transition-none overlay-y-[overlay] mt-2 pb-0 left-0 right-auto top-full origin-top-left transform !scale-x-100 opacity-100 visible shadow-[0_0_10px_rgba(0_0_0_0.15)] backdrop-filter backdrop-blur-[50px] bg-[rgba(33,33,33,0.75)] rounded-[10px] text-[1rem] py-[0.3125rem] px-0 absolute z-[4] select-none"
      >
        <div
          className="!cursor-pointer !pointer-events-auto flex items-center rounded-[0.3125rem] text-white text-[14px] font-medium h-8 leading-[18px] mx-[0.3125rem] py-1 pl-3 relative transform scale-100 whitespace-nowrap text-left pr-[0.375rem] hover:bg-[rgba(171,171,171,0.08)]"
          onClick={() => setToggleSettings((prev) => !prev)}
        >
          <IoSettingsOutline
            style={{
              marginRight: '1.25rem',
              position: 'relative',
              alignSelf: 'flex-start',
              color: 'white',
              fontSize: '1.25rem',
              marginTop: '0.125rem',
            }}
          />
          <span className="pointer-events-none flex-auto relative">
            Settings
          </span>
        </div>
        <div
          className="!cursor-pointer !pointer-events-auto flex items-center rounded-[0.3125rem] text-white text-[14px] font-medium h-8 leading-[18px] mx-[0.3125rem] py-1 pl-3 relative transform scale-100 whitespace-nowrap text-left pr-[0.375rem] hover:bg-[rgba(171,171,171,0.08)]"
          onClick={() => setToggleDarkMode((prev) => !prev)}
        >
          <MdOutlineDarkMode
            style={{
              marginRight: '1.25rem',
              position: 'relative',
              alignSelf: 'flex-start',
              color: 'white',
              fontSize: '1.25rem',
              marginTop: '0.125rem',
            }}
          />
          <span className="pointer-events-none flex-auto relative">
            Dark Mode
          </span>
          <label className="cursor-pointer min-h-[20px] min-w-[20px] relative pointer-events-none flex items-center my-0 mx-[0.3125rem] p-0 text-left">
            <input
              type="checkbox"
              checked={toggleDarkMode}
              onChange={() => setToggleDarkMode((prev) => !prev)}
              className="box-border opacity-0 p-0 absolute z-[-1] bg-transparent caret-[#8774e1] text-white overflow-visible leading-[1.15] m-0 text-[100%]"
            />
            <div
              className={`flex relative items-center  rounded-xl h-[0.875rem] my-0 mx-[3px] w-[1.9375rem] before:bg-[#212121] before:border-[2px] before:rounded-[50%] before:content-[' '] before:h-[1.25rem] before:absolute before:transform before:w-[1.25rem] ${
                toggleDarkMode
                  ? 'bg-[#8774e1] before:border-[#8774e1] before:translate-x-[calc((1.9375rem-1.25rem)+3px)]'
                  : 'bg-[#707579] before:translate-x-[calc(3px*-1)] before:border-[#707579]'
              }`}
            ></div>
          </label>
        </div>
        <a
          className="flex items-center rounded-bl-[10px] rounded-br-[10px] text-current text-[0.875rem] h-10 justify-center"
          href="https://github.com/IvanGaenko/messengerjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>My messenger 1.1.0</span>
        </a>
      </div>
    </>
  );
};

export default MainMenu;
