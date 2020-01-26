// Imports
import React from 'react';
import { useSelector } from 'react-redux';

// Component
const Profile = () => {
  // state
  const { details } = useSelector(state => state.auth);

  return (
    <div>
      <p>Profile</p>

      <div>
        <p>Sunt consiliumes convertam nobilis, neuter cobaltumes.</p>
        <p>Name: {details.name}</p>
        <p>Email: {details.email}</p>
      </div>
    </div>
  );
};

export default Profile;
