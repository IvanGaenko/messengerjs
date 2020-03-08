// Import database
import db from '../models';

// Check connection
const connection = () => {
  db.sequelize
    .authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Unable to connect to the database'));
};

export default connection;
