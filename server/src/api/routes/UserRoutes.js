import { Router } from 'express';
import UserController from '../../controllers/UserController';

const router = Router();

export default app => {
  app.use('/users', router);

  router.get('/', UserController.getAllUsers);
  router.post('/', UserController.addUser);
  router.get('/:id', UserController.getAUser);
  router.put('/:id', UserController.updatedUser);
  router.delete('/:id', UserController.deleteUser);
};
