import database from '../models';
const { User } = database.sequelize.models;

class AuthService {
  static async registerUser(newUser) {
    try {
      return await User.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  static async loginUser(email) {
    try {
      const theUser = await User.findOne({
        where: { email: email },
      });
      return theUser;
    } catch (error) {
      throw error;
    }
  }

  static async findUserId(id) {
    console.log('findUserId');
    try {
      const findedUser = await User.findOne({
        where: { id: id },
      });
      return findedUser;
    } catch (error) {
      throw error;
    }
  }

  static async findUsername(email) {
    try {
      const findedUsername = await User.findOne({
        where: { email: email },
      });
      // console.log('findUsername', findedUsername);
      return findedUsername;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
