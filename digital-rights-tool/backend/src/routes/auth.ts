import express from 'express';
import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', verifyToken, getProfile);

export const authRoutes = router; 