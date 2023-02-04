import { Router } from 'express';
import { chatListController } from '../controllers/chat.controller';
import { jwtAuth } from '../middleware/jwtAuth';

const userRouter = Router();

userRouter.get('/chat', jwtAuth, chatListController);
// userRouter.get('/chat/:id', jwtAuth, chatController);

export default userRouter;
