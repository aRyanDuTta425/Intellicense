import express from 'express';
import authRoutes from './auth';
import uploadRoutes from './upload';
import analysisRoutes from './analysis';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/uploads', uploadRoutes);
router.use('/analyses', analysisRoutes);

export default router; 