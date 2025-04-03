import { Hono } from 'hono';
import { register, login, getProfile } from '../controllers/auth';
import { verifyToken } from '../middleware/auth';

const router = new Hono();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', verifyToken, getProfile);

export const authRoutes = router; 