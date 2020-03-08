import database from '../models';

class AuthService {
  static async registerUser(newUser) {
    try {
      return await database.Users.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  static async loginUser(email) {
    try {
      const theUser = await database.Users.findOne({
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
      const findedUser = await database.Users.findOne({
        where: { id: id },
      });
      return findedUser;
    } catch (error) {
      throw error;
    }
  }

  static async findUsername(email) {
    console.log('findUsername');
    try {
      const findedUsername = await database.Users.findOne({
        where: { email: email },
      });
      return findedUsername;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
