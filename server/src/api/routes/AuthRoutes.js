import { Router } from 'express';
import AuthController from '../../controllers/AuthController';

const router = Router();

export default app => {
  app.use('/auth', router);

  // router.get('/', AuthController.getAllUsers);
  router.post('/register', AuthController.registerUser);
  router.post('/login', AuthController.loginUser);
  // router.get('/:id', AuthController.getAUser);
  // router.put('/:id', AuthController.updatedUser);
  // router.delete('/:id', AuthController.deleteUser);
};
