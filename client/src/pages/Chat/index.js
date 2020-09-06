// Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// UI Imports
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import styles from './styles';

// App Imports
import { getChatRooms } from '../../api/actions/chat';
import { io } from '../../setup/socket';
import FriendMessagePanel from '../FriendMessagePanel';
import Section from '../../modules/Section';
import Loading from '../Loading';
import { getMessageLimit } from '../../setup/utils';

// Component
const Chat = ({ classes }) => {
  // state
  const [initialized, setInitialized] = useState(false);
  const { rooms, isLoading } = useSelector(state => state.chat);
  const { details } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  // get Rooms
  const getRooms = async () => {
    console.log('getRooms');
    dispatch(getChatRooms(details.id, details.friendList, getMessageLimit));
    setInitialized(true);
  };

  useEffect(() => {
    if (!initialized) {
      getRooms();
    }

    io.on('unread', async () => {
      console.log('hey! new messages!');
      await getRooms();
    });

    io.on('updateMessage', async () => {
      console.log('hey! update messages!');
      await getRooms();
    });

    return () => {
      io.off('unread');
      io.off('updateMessage');
    };
  });

  // render
  return (
    <div className={classes.root}>
      <Typography variant="h6" color="inherit" className={classes.grow}>
        Chat
      </Typography>
      <Section>
        {isLoading ? <Loading /> : <FriendMessagePanel rooms={rooms} />}
      </Section>
    </div>
  );
};

// Component Properties
Chat.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Chat);
