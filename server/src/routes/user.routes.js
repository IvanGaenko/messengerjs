import { Router } from 'express';
import { profileController } from '../controllers/user.controller';
import { jwtAuth } from '../middleware/jwtAuth';

const userRouter = Router();

userRouter.get('/current', jwtAuth, profileController);

export default userRouter;
