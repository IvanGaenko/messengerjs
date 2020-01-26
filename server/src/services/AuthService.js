import database from '../models';

class AuthService {
  static async registerUser(newUser) {
    try {
      return await database.AuthDatabase.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  static async loginUser(email) {
    try {
      const theUser = await database.AuthDatabase.findOne({
        where: { email: email },
      });
      return theUser;
    } catch (error) {
      throw error;
    }
  }

  static async findUserId(id) {
    try {
      const findedUser = await database.AuthDatabase.findOne({
        where: { id: id },
      });
      return findedUser;
    } catch (error) {
      throw error;
    }
  }

  static async findUsername(email) {
    try {
      const findedUsername = await database.AuthDatabase.findOne({
        where: { email: email },
      });
      return findedUsername;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
