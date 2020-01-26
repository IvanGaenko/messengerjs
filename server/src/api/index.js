import { Router } from 'express';
import UserRoutes from './routes/UserRoutes';
import AuthRoutes from './routes/AuthRoutes';

export default () => {
  const app = Router();

  AuthRoutes(app);
  UserRoutes(app);

  return app;
};
