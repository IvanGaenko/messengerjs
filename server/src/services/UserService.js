import database from '../models';

class UserService {
  static async getAllUsers() {
    try {
      return await database.Users.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async addUser(newUser) {
    try {
      return await database.Users.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  static async updatedUser(id, updateUser) {
    try {
      const userToUpdate = await database.Users.findOne({
        where: { id: Number(id) },
      });
      if (userToUpdate) {
        await database.Users.update(updateUser, {
          where: {
            id: Number(id),
          },
        });
        return updateUser;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getUser(id) {
    try {
      const theUser = await database.Users.findOne({
        where: { id: Number(id) },
      });

      return theUser;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const userToDelete = await database.Users.findOne({
        where: { id: Number(id) },
      });
      if (userToDelete) {
        const deletedUser = await database.Users.destroy({
          where: { id: Number(id) },
        });
        return deletedUser;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
