// Imports
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { throttle } from 'lodash';

// App Imports
import { io } from '../setup/socket';
import {
  getRoom,
  getChatRoomMessage,
  clearRawMessages,
  getNewChatMessages,
} from '../api/actions/chat';
import {
  updateClientMessages,
  // getMoreMessages
} from '../api/actions/messages';
import routes from '../setup/routes';
import ChatRoomInput from './ChatRoomInput';
import ChatRoomList from './ChatRoomList';
import Loading from './Loading';
import { getMessageLimit } from '../setup/utils';

function ChatRoom() {
  // State
  const { id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [clear, setClear] = useState(false);
  const [initPosition, setInitPosition] = useState(false);
  const [fixedScroll, setFixedScroll] = useState(true);
  const [fetchMoreMessages, setFetchMoreMessages] = useState(false);

  const { room, isLoading, isRoomLoading, isMessageLoading } = useSelector(
    state => state.chat,
  );
  const { details } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const ref = React.createRef();

  // Connect To Room
  const connectToRoom = async () => {
    await getCurrentRoom();
    await getMessage();
  };

  // get Current Room
  const getCurrentRoom = async () => {
    console.log('getCurrentRoom');
    dispatch(getRoom(details.id, id, getMessageLimit));
    setInitialized(true);
  };

  // Get Message
  const getMessage = async () => {
    // console.log('getMessageLimit', getMessageLimit);
    let limit;
    if (!fetchMoreMessages) {
      limit = getMessageLimit;
      setFetchMoreMessages(true);
      console.log('fetchMoreMessages if false', fetchMoreMessages);
      console.log('limit true', limit);
    } else {
      limit = getMessageLimit * 2;
      console.log('limit false', limit);
      // setFixedScroll(false);
    }

    dispatch(getChatRoomMessage(details.id, id, limit));
    setInitialized(true);
  };

  // Get New Message
  const getNewMessages = async data => {
    dispatch(getNewChatMessages(data));
  };

  // Update New Messages
  const updateNewMessages = async data => {
    dispatch(updateClientMessages(data));
  };

  // Clear Readed Messages
  const clearRaw = async () => {
    dispatch(clearRawMessages(details.id, id, details.name));
    setClear(true);
  };

  const handleScroll = () => {
    let clientHeight = document.documentElement.clientHeight;
    let scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight,
    );
    let scrollTop = document.documentElement.scrollTop;
    let diffScreen = scrollHeight - clientHeight;

    if (diffScreen - scrollTop > 20) {
      console.log('im here');
      setFixedScroll(false);
      fetchMoreMessage();
    } else {
      setFixedScroll(true);
    }

    // if (document.documentElement.scrollTop > 10) return;
    // console.log('works!');
    // fetchMoreMessage();
  };

  const throttledHandleScroll = throttle(handleScroll, 1000);

  const fetchMoreMessage = async () => {
    console.log('got it!');
    // setFixedScroll(false);
    console.log('fixedScroll before get', fixedScroll);
    if (!fixedScroll) {
      await getMessage();
    }
    // dispatch(getMoreMessages(details.id, id, limit));
  };

  const setupInitPosition = () => {
    if (!isLoading && !isRoomLoading && !isMessageLoading && !initPosition) {
      console.log('initPosition', initPosition);
      ref.current.scrollIntoView(false);
      setInitPosition(true);
    }
  };

  useEffect(() => {
    // document.documentElement.scrollTop =
    //   document.documentElement.offsetHeight - window.innerHeight;

    if (!initialized) {
      connectToRoom();
    }

    if (!clear) {
      clearRaw();
    }

    if (fixedScroll) {
      setupInitPosition();
    }

    // if (shouldFetch) {
    //   console.log('shouldFetch', shouldFetch);

    //   fetchMessage();
    // }

    io.on('newMessage', async data => {
      console.log('hey! new messages!');
      await getNewMessages(data);
      setClear(false);
      console.log('fixedScroll', fixedScroll);

      if (fixedScroll) {
        setInitPosition(false);
      }
    });

    io.on('updateMessage', async data => {
      await updateNewMessages(data);
    });

    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      io.off('newMessage');
      io.off('updateMessage');
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  });

  return (
    <div className="container">
      <Link to={routes.chat.path}>Back</Link>
      <div>{room.name}</div>

      {isLoading || isRoomLoading || isMessageLoading ? (
        <Loading />
      ) : (
        <div>
          <ChatRoomList />
          <div ref={ref}>
            <ChatRoomInput />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatRoom;
