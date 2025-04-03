import express from 'express';
import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { analyzeFile, getAnalysis, getAnalyses, deleteAnalysis } from '../controllers/analysis';

const router = Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Routes
router.post('/:uploadId', analyzeFile);
router.get('/:id', getAnalysis);
router.get('/', getAnalyses);
router.delete('/:id', deleteAnalysis);

export const analysisRoutes = router; 