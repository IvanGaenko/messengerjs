// Imports
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// UI Imports
import Typography from '@material-ui/core/Typography/Typography';
import { withStyles } from '@material-ui/core/styles/index';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import styles from './styles';

// App Imports
// import { addFriend } from '../../api/actions/auth';
import Section from '../../modules/Section';

// Component
const Profile = ({ classes }) => {
  // state
  const { details } = useSelector((state) => state.auth);
  const [searchId, setSearchId] = useState('');
  const dispatch = useDispatch();

  const onChange = (event) => {
    setSearchId(event.target.value);
  };

  const onSend = (event) => {
    event.preventDefault();
    // dispatch(addFriend(searchId, details.friendList, details.id));
    setSearchId('');
  };

  return (
    <div>
      <Typography variant="h6" color="inherit" className={classes.grow}>
        Profile
      </Typography>

      <Section>
        <Typography paragraph>
          Sunt consiliumes convertam nobilis, neuter cobaltumes.
        </Typography>

        <Typography>Username: {details.username}</Typography>
        <Typography>Email: {details.email}</Typography>

        <form onSubmit={onSend} className={classes.root}>
          {/* Input - add friend */}
          <Input
            id="standard-basic"
            label="Type friend's id"
            type="text"
            name="friend_search"
            value={searchId}
            onChange={onChange}
            placeholder="Type friend's id"
            required={true}
            autoFocus
          />

          {/* Button - send */}
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Section>
    </div>
  );
};

// Component Properties
Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
