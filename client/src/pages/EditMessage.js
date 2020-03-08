// Imports
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

// App Imports
import { editChatMessages, deleteChatMessage } from '../api/actions/messages';

// Component
const EditMessage = props => {
  const { id, author } = props;
  //State
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  // On Change
  const onChange = event => {
    setMessage(event.target.value);
  };

  // Complete Edit
  const onSubmitEdit = event => {
    event.preventDefault();
    dispatch(editChatMessages(id, author, message));
    setMessage('');
    setEditMode(false);
  };

  // Start Edit Message
  const startEdit = () => {
    setEditMode(true);
  };

  // Cancel Edit Message
  const cancelEdit = () => {
    setEditMode(false);
    setMessage('');
  };

  // Delete Message
  const deleteMessage = () => {
    dispatch(deleteChatMessage(id, author));
    setEditMode(false);
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
              value={message}
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
        <button onClick={startEdit}>Edit</button>
      )}
    </span>
  );
};

export default EditMessage;
