import { Hono } from 'hono';
import { verifyToken } from '../middleware/auth';
import { analyzeContent, getAnalysisById, getUserAnalyses, deleteAnalysis } from '../controllers/analysis';

const router = new Hono();

// Apply auth middleware to all routes
router.use('*', verifyToken);

// Routes
router.post('/:uploadId', analyzeContent);
router.get('/:id', getAnalysisById);
router.get('/', getUserAnalyses);
router.delete('/:id', deleteAnalysis);

export const analysisRoutes = router; 