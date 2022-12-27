// Imports
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// App Imports
import { editChatMessages, deleteChatMessage } from '../api/actions/messages';
import { socketEmit } from '../setup/socket';

// Component
const EditMessage = (props) => {
  const { id, author, message, connectionData } = props;
  //State
  const [editMode, setEditMode] = useState(false);
  const [editMessage, setEditMessage] = useState(message);
  const { details } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  // On Change
  const onChange = (event) => {
    setEditMessage(event.target.value);
  };

  // Complete Edit
  const onSubmitEdit = (event) => {
    event.preventDefault();
    dispatch(editChatMessages(id, author, editMessage, connectionData));
    setEditMode(false);

    const data = {
      messageId: id,
      author,
      message: editMessage,
      roomName: connectionData,
      status: 'update',
    };
    socketEmit('checkMessage', data);
  };

  // Start Edit Message
  const startEdit = () => {
    setEditMode(true);
  };

  // Cancel Edit Message
  const cancelEdit = () => {
    setEditMode(false);
  };

  // Delete Message
  const deleteMessage = () => {
    dispatch(deleteChatMessage(id, author, connectionData));
    setEditMode(false);

    const data = {
      messageId: id,
      author,
      message: editMessage,
      roomName: connectionData,
      status: 'delete',
    };
    socketEmit('checkMessage', data);
  };

  return (
    <span>
      {editMode ? (
        <div>
          <form onSubmit={onSubmitEdit}>
            {/* Input - message */}
            <input
              type="text"
              name="message"
              value={editMessage}
              onChange={onChange}
              label="Message"
              placeholder="Edit message"
              required={true}
              autoFocus
            />

            {/* Button - send */}
            <input type="submit" />
          </form>
          <div>
            <button onClick={cancelEdit}>Cancel</button>
            <button onClick={deleteMessage}>Delete</button>
          </div>
        </div>
      ) : (
        <span>
          {message}
          {details.name !== author ? null : (
            <button onClick={startEdit}>Edit</button>
          )}
        </span>
      )}
    </span>
  );
};

export default EditMessage;
