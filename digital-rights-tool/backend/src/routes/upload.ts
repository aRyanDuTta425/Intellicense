import { Hono } from 'hono';
import { verifyToken } from '../middleware/auth';
import { uploadFile, getUploads, getUploadById, deleteUpload } from '../controllers/upload';

const router = new Hono();

// Apply auth middleware to all routes
router.use('*', verifyToken);

// Routes
router.post('/', uploadFile);
router.get('/', getUploads);
router.get('/:id', getUploadById);
router.delete('/:id', deleteUpload);

export const uploadRoutes = router; 