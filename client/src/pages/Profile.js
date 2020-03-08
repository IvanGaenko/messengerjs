// Imports
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// App Imports
import { addFriend } from '../api/actions/auth';

// Component
const Profile = () => {
  // state
  const { details } = useSelector(state => state.auth);
  const [searchId, setSearchId] = useState('');
  const dispatch = useDispatch();

  const onChange = event => {
    setSearchId(event.target.value);
  };

  const onSend = event => {
    event.preventDefault();
    dispatch(addFriend(searchId, details.friendList, details.id));
    setSearchId('');
  };

  return (
    <div>
      <p>Profile</p>

      <div>
        <p>Sunt consiliumes convertam nobilis, neuter cobaltumes.</p>
        <p>Name: {details.name}</p>
        <p>Email: {details.email}</p>
        <form onSubmit={onSend}>
          {/* Input - add friend */}
          <input
            type="text"
            name="friend_search"
            value={searchId}
            onChange={onChange}
            label="FriendSearch"
            placeholder="Type friend's id"
            required={true}
            autoFocus
          />

          {/* Button - send */}
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Profile;
