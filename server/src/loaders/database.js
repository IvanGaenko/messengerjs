// Import database
import db from '../models';

// Check connection
// const connection = () => {
//   db.sequelize
//     .authenticate()
//     .then(() => console.log('Database connected'))
//     .catch(err => console.error('Unable to connect to the database'));
// };

const connection = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default connection;
