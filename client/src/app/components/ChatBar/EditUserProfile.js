import { useState } from 'react';
import { useSelector } from 'react-redux';

import { BiCheck, BiArrowBack, BiImageAdd } from 'react-icons/bi';
import UserIcon from '../../common/UserIcon';

import { socket } from '../../socket';

const EditUserProfile = ({ setToggleEditProfile }) => {
  const { username, email } = useSelector((state) => state.user);

  const [editUsernameHover, setEditUsernameHover] = useState(false);
  const [editUsernameFocus, setEditUsernameFocus] = useState(false);
  const [editUsernameValue, setEditUsernameValue] = useState(username);

  const [editEmailHover, setEditEmailHover] = useState(false);
  const [editEmailFocus, setEditEmailFocus] = useState(false);
  const [editEmailValue, setEditEmailValue] = useState(email);

  const onSubmitEditUser = () => {
    const userChanges = {};
    if (username !== editUsernameValue)
      userChanges.username = editUsernameValue;
    if (email !== editEmailValue) userChanges.email = editEmailValue;
    console.log('submit user changes', userChanges);
    socket.emit('changeUserProfileData', userChanges);
    setToggleEditProfile(false);
  };

  return (
    <div className="!transition-none flex bg-[#181818] flex-col col-start-1 row-start-1 overflow-hidden">
      <div className="relative flex items-center bg-[#212121] cursor-default flex-[0_0_auto] justify-between min-h-[3.5rem] px-4 select-none after:absolute after:bg-[#0f0f0f] after:bottom-[-1px] after:content-[' '] after:h-[1px] after:left-0 after:opacity-0 after:right-0 after:z-[1]">
        <button
          className="transition-none flex-[0_0_auto] h-10 w-10 overflow-hidden flex items-center bg-transparent border-none text-[#aaa] text-[1.5rem] justify-center leading-[1] p-2 relative text-center !rounded-[50%] cursor-pointer outline-none hover:bg-[rgba(171,171,171,0.08)]"
          onClick={() => {
            setToggleEditProfile(false);
            setEditUsernameValue(username);
            setEditEmailValue(email);
          }}
        >
          <BiArrowBack />
        </button>
        <div className="pl-6 text-white flex-1 text-[1.25rem] font-medium">
          Edit Profile
        </div>
      </div>
      <div className="flex flex-col flex-auto h-full max-h-full overflow-hidden relative w-full">
        <div
          className="overflow-y-[overlay] absolute bottom-0 h-full left-0 max-h-full overflow-x-hidden right-0 top-0 w-full"
          style={{
            transform: 'translateZ(0)',
          }}
        >
          <div className="select-none">
            <div className="bg-[#212121] shadow-[0_1px_3px_0_rgba(0_0_0_0.12)] mb-3 !py-2 !px-0">
              <div className="my-0 mx-2">
                <div className="h-[120px] w-[120px] mt-4 mx-auto mb-8 rounded-[50%] cursor-pointer overflow-hidden relative">
                  <canvas className="bg-gradient-to-b from-[#69bffa] to-[#3d9de0] h-full max-h-full w-full max-w-full inline-block" />
                  <span className="absolute text-white text-[3rem] h-12 top-[52%] left-[50%] leading-[1] transform translate-y-[-50%] translate-x-[-50%] w-12 z-[2]">
                    <BiImageAdd />
                  </span>
                  <UserIcon
                    username={username}
                    style={{
                      position: 'absolute',
                      height: '100%',
                      left: 0,
                      top: 0,
                      width: '100%',
                      filter: 'brightness(0.7)',
                      fontSize: 'calc(1.25rem/0.45)',
                      fontWeight: 500,
                    }}
                  />
                </div>
                <div className="w-[420px] my-3 mx-0 max-w-full py-0 px-3">
                  <div className="relative">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onMouseEnter={() => setEditUsernameHover(true)}
                      onMouseLeave={() => setEditUsernameHover(false)}
                      onInput={(e) =>
                        setEditUsernameValue(e.target.textContent)
                      }
                      onClick={() => setEditUsernameFocus(true)}
                      onBlur={() => setEditUsernameFocus(false)}
                      className="!transition-none cursor-text outline-none select-text whitespace-pre-wrap bg-transparent caret-[#8774e1] text-white border-[1px] border-[#2f2f2f] hover:border-[#8774e1] rounded-[10px] box-border leading-[1.3125] min-h-[54px] py-[calc(1rem-1px)] px-[calc(1rem-1px)] relative w-full z-[1]"
                    >
                      {username}
                    </div>
                    {editUsernameFocus && (
                      <div className="border-[2px] border-[#8774e1] rounded-[10px] absolute bottom-0 left-0 pointer-events-none right-0 top-0 z-[1]"></div>
                    )}
                    <label
                      className={`bg-[#212121] ${
                        editUsernameFocus || editUsernameHover
                          ? 'text-[#8774e1]'
                          : 'text-[#9e9e9e]'
                      } h-6 mt-[calc((54px-1.5rem)/2)] pointer-events-none absolute right-auto top-0 origin-[left_center] select-none whitespace-nowrap z-[2] left-4 py-0 opacity-100 px-[0.3125rem] transform ${
                        editUsernameValue.length > 0 || editUsernameFocus
                          ? 'translate-x-[-0.1875rem] translate-y-[calc(54px/-2+0.0625rem)] scale-75'
                          : 'translate-x-0 translate-y-0'
                      }`}
                    >
                      Username
                    </label>
                  </div>
                  <div className="relative mt-6">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onMouseEnter={() => setEditEmailHover(true)}
                      onMouseLeave={() => setEditEmailHover(false)}
                      onInput={(e) => setEditEmailValue(e.target.textContent)}
                      onClick={() => setEditEmailFocus(true)}
                      onBlur={() => setEditEmailFocus(false)}
                      className="!transition-none cursor-text outline-none select-text whitespace-pre-wrap bg-transparent caret-[#8774e1] text-white border-[1px] border-[#2f2f2f] hover:border-[#8774e1] rounded-[10px] box-border leading-[1.3125] min-h-[54px] py-[calc(1rem-1px)] px-[calc(1rem-1px)] relative w-full z-[1]"
                    >
                      {email}
                    </div>
                    {editEmailFocus && (
                      <div className="border-[2px] border-[#8774e1] rounded-[10px] absolute bottom-0 left-0 pointer-events-none right-0 top-0 z-[1]"></div>
                    )}
                    <label
                      className={`bg-[#212121] ${
                        editEmailFocus || editEmailHover
                          ? 'text-[#8774e1]'
                          : 'text-[#9e9e9e]'
                      } h-6 mt-[calc((54px-1.5rem)/2)] pointer-events-none absolute right-auto top-0 origin-[left_center] select-none whitespace-nowrap z-[2] left-4 py-0 opacity-100 px-[0.3125rem] transform ${
                        editEmailValue.length > 0 || editEmailFocus
                          ? 'translate-x-[-0.1875rem] translate-y-[calc(54px/-2+0.0625rem)] scale-75'
                          : 'translate-x-0 translate-y-0'
                      }`}
                    >
                      Email
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {(username !== editUsernameValue || email !== editEmailValue) && (
          <button
            className="!transition-none right-5 select-none rounded-[50%] h-[54px] w-[54px] leading-[54px] flex items-center text-[1.5rem] bg-[#8774e1] border-none bottom-5 text-white cursor-pointer justify-center outline-none text-center transform-gpu translate-x-0 translate-y-0 z-[3] !shadow-none !p-0 !absolute hover:bg-[#6a52da]"
            onClick={onSubmitEditUser}
          >
            <BiCheck />
          </button>
        )}
      </div>
    </div>
  );
};

export default EditUserProfile;
