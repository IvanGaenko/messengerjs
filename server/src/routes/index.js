// Imports
import { Router } from 'express';

// App Imports
import authRouter from './auth.routes';
import userRouter from './user.routes';
import { endpoint } from '../config/env';

const apiRouter = Router();

// apiRouter.use('/api/v1/auth', authRouter);
// apiRouter.use('/api/v1/user', userRouter);
apiRouter.use(endpoint.auth, authRouter);
apiRouter.use(endpoint.url, userRouter);

export default apiRouter;
