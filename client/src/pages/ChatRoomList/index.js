// Imports
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// UI Imports
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

// App Imports
import EditMessage from '../EditMessage';
import Section from '../../modules/Section';

// Component
const ChatRoomList = classes => {
  //State
  const { messages, connectionData } = useSelector(state => state.chat);

  return (
    <Section>
      {messages.map(t => {
        return (
          <div key={t.id} style={{ padding: '10px' }}>
            <span className={classes.container}>{t.author}:</span>
            <EditMessage
              id={t.id}
              author={t.author}
              message={t.message}
              connectionData={connectionData}
            />
          </div>
        );
      })}
    </Section>
  );
};

// Component Properties
ChatRoomList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatRoomList);
