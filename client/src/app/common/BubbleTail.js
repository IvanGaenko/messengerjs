const BubbleTail = ({ isMine }) => {
  return (
    <svg
      viewBox="0 0 11 20"
      xmlns="<http://www.w3.org/2000/svg>"
      width="11"
      height="20"
      className={`${
        isMine ? 'fill-[#8774e1] right-[-8.4px] scale-x-[-1]' : 'fill-[#212121]'
      } 
      block h-[20px] absolute transform translate-y-[1px] w-[11px] z-[-2] ml-[-8.4px]`}
    >
      <use
        xmlns="<http://www.w3.org/2000/svg>"
        href="#message-tail-filled"
      ></use>
    </svg>
  );
};

export default BubbleTail;
