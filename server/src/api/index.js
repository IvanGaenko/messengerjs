import { Router } from 'express';
import UserRoutes from './routes/UserRoutes';

export default () => {
  const app = Router();

  UserRoutes(app);

  return app;
};
