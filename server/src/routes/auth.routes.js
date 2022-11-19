import { Router } from 'express';
import {
  signupController,
  loginController,
  logoutController,
  refreshTokensController,
} from '../controllers/auth.controller';
import loginAuth from '../middleware/loginAuth';

const authRouter = Router();

authRouter.post('/signup', signupController);
authRouter.post('/login', loginAuth, loginController);
authRouter.post('/logout', logoutController);
authRouter.post('/refresh-tokens', refreshTokensController);

export default authRouter;
