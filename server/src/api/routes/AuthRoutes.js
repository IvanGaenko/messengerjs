import { Router } from 'express';
import AuthController from '../../controllers/AuthController';

const router = Router();

export default app => {
  app.use('/auth', router);

  router.post('/register', AuthController.registerUser);
  router.post('/login', AuthController.loginUser);
};
