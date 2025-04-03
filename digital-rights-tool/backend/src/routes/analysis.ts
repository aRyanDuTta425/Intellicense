import { Hono } from 'hono';
import { analyzeContent, getAnalysisById, getUserAnalyses, deleteAnalysis } from '../controllers/analysis';
import { verifyToken } from '../middleware/auth';

const router = new Hono();

// Create analysis for an upload
router.post('/:uploadId', verifyToken, analyzeContent);

// Get analysis for an upload
router.get('/:id', verifyToken, getAnalysisById);

// Get all analyses for a user
router.get('/', verifyToken, getUserAnalyses);

// Delete an analysis
router.delete('/:id', verifyToken, deleteAnalysis);

export const analysisRoutes = router; 