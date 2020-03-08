// Imports
import React from 'react';
import { useSelector } from 'react-redux';

// Component
const UnreadMessageCount = props => {
  // State
  const { room } = props;
  const { details } = useSelector(state => state.auth);

  return (
    <span>
      {room.rawMessages.filter(r => r.author !== details.name).length === 0
        ? null
        : `+${room.rawMessages.filter(r => r.author !== details.name).length}`}
    </span>
  );
};

export default UnreadMessageCount;
