import { BiTrashAlt } from 'react-icons/bi';
import { BsCheckCircle } from 'react-icons/bs';

const FriendMenu = ({ friendMenuRef }) => {
  return (
    <>
      <div className="!max-w-none !fixed !w-auto -bottom-full cursor-default -left-full -right-full -top-full select-none z-[4]"></div>
      <div
        ref={friendMenuRef}
        className="max-h-[calc(4.12px*100-4.375rem)] absolute z-[4] top-[calc(100%+7px)] transition-none mt-2 left-auto right-0 origin-top-right transform !scale-x-100 shadow-[0_0_10px_rgba(0_0_0_0.15)] backdrop-blur-[50px] bg-[rgba(33,33,33,0.75)] rounded-[10px] text-[1rem] min-w-[11.25rem] py-[0.3125rem] px-0 select-none !cursor-pointer !pointer-events-auto leading-[1] text-center"
        style={{
          overflowY: 'overlay',
        }}
      >
        <div className="text-left flex items-center rounded-[0.3125rem] text-white text-[14px] font-medium h-8 leading-[18px] mx-[0.3125rem] py-1 px-3 relative transform scale-100 whitespace-nowrap !cursor-pointer !pointer-events-auto hover:bg-[rgba(171,171,171,0.08)]">
          <BsCheckCircle
            style={{
              marginRight: '1.25rem',
              marginTop: '0.125rem',
              fontSize: '1.25rem',
            }}
          />
          <span>Select Messages</span>
        </div>
        <div className="text-left flex items-center rounded-[0.3125rem] text-[#ff595a] text-[14px] font-medium h-8 leading-[18px] mx-[0.3125rem] py-1 px-3 relative transform scale-100 whitespace-nowrap !cursor-pointer !pointer-events-auto hover:bg-[rgba(171,171,171,0.08)]">
          <BiTrashAlt
            style={{
              marginRight: '1.25rem',
              marginTop: '0.125rem',
              fontSize: '1.25rem',
            }}
          />
          <span>Delete Chat</span>
        </div>
      </div>
    </>
  );
};

export default FriendMenu;
