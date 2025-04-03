import express from 'express';
import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { uploadFile, getFiles, getFile, deleteFile } from '../controllers/upload';

const router = Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Routes
router.post('/', uploadFile);
router.get('/', getFiles);
router.get('/:id', getFile);
router.delete('/:id', deleteFile);

export const uploadRoutes = router; 