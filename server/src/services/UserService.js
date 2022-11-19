// App Imports
import database, { Sequelize } from '../models';
// const Op = Sequelize.Op;
import { Op } from 'sequelize';

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

  static async getChatRooms(friendList) {
    try {
      console.log('getChatRooms');
      return await database.Users.findAll({
        where: {
          id: {
            [Op.in]: friendList,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Users
  static async getChatRooms(friendList) {
    try {
      console.log('getChatRooms');
      return await database.Users.findAll({
        where: {
          id: {
            [Op.in]: friendList,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Users
  static async addFriend(userId, newFriendList) {
    try {
      console.log('addFriend', userId, newFriendList);
      return await database.Users.update(
        {
          friendList: newFriendList,
        },

        {
          where: {
            id: userId,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }

  // Users
  static async getChatRoom(id) {
    try {
      console.log('getChatRoom');
      const chatRoomName = await database.Users.findOne({
        where: { id: id },
      });

      return chatRoomName;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
