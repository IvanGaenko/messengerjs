import db from '../models';
// import { seed } from '../models/seed';

// Check connection
// const connection = () => {
//   db.sequelize
//     .authenticate()
//     .then(() => console.log('Database connected'))
//     .catch(err => console.error('Unable to connect to the database'));
// };
// let x = true;

const connection = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  // if (x) {
  //   await db.user.create({
  //     username: 'Encrenoire',
  //     email: 'gaenko037@gmail.com',
  //     password: '1234567',
  //   });
  //   x = false;
  // }
  // await seed(db.user);
};

export default connection;
