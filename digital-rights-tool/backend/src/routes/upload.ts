import { Hono } from 'hono';
import { uploadFile, getUploads, getUploadById, deleteUpload } from '../controllers/upload';
import { verifyToken } from '../middleware/auth';

const router = new Hono();

// Upload a file
router.post('/', verifyToken, uploadFile);

// Get user's uploads
router.get('/', verifyToken, getUploads);

// Get a specific upload
router.get('/:id', verifyToken, getUploadById);

// Delete a specific upload
router.delete('/:id', verifyToken, deleteUpload);

export const uploadRoutes = router; 