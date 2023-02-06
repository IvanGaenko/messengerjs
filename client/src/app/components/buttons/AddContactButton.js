import { useSelector, useDispatch } from 'react-redux';

import { setAddUserModal } from '../../slices/handler.slice';

import { HiPencil } from 'react-icons/hi';

const AddContactButton = () => {
  const { isOpenAddUserModal } = useSelector((state) => state.handler);
  const dispatch = useDispatch();
  return (
    <button
      className="!transition-none right-5 rounded-[50%] h-[54px] leading-[54px] w-[54px] !cursor-pointer !font-normal overflow-visible flex justify-center items-center outline-none text-center z-[3] bg-[#8774e1] border-none bottom-5 text-white !shadow-none !p-0 m-0 !absolute hover:bg-[#6a52da]"
      style={{
        transform: 'translateZ(0)',
        fontSize: '1.5rem',
      }}
      onClick={() => dispatch(setAddUserModal(!isOpenAddUserModal))}
    >
      <HiPencil
        style={{
          visibility: 'visible !important',
          height: '24px',
          lineHeight: '24px',
          position: 'absolute',
        }}
      />
    </button>
  );
};

export default AddContactButton;
