import { Router } from 'express';
import UserController from '../../controllers/UserController';
import passport from 'passport';

const pass = passport.authenticate('jwt', { session: false });

const router = Router();

export default app => {
  app.use('/users', pass, router);

  router.get('/', UserController.getAllUsers);
  router.post('/', UserController.addUser);
  router.get('/:id', UserController.getAUser);
  router.put('/:id', UserController.updatedUser);
  router.delete('/:id', UserController.deleteUser);
};
