import { Router } from 'express';
import UserRoutes from './routes/UserRoutes';

const router = Router();

router.use('/users', UserRoutes);

export default router;