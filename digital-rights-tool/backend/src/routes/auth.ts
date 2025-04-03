import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);

export default router; 