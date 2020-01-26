// Import database
import db from '../models';

// Check connection
const connection = () => {
  db.sequelize
    .authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Unable to connect to the database'));

  // db.sequelize
  //   .sync()
  //   .then(() => console.log('Database synchronized'))
  //   .catch(err => console.error('Unable to synchronize the database', err));
};

export default connection;
