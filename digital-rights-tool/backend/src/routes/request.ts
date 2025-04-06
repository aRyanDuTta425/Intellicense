import { Hono } from 'hono';
import { createRequest, getUserRequests, getRequestById } from '../controllers/request';
import { verifyToken } from '../middleware/auth';

const router = new Hono();

// Create a new request
router.post('/', verifyToken, createRequest);

// Get user's requests
router.get('/', verifyToken, getUserRequests);

// Get a specific request
router.get('/:id', verifyToken, getRequestById);

export default router; 