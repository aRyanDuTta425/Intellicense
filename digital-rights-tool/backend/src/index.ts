import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { register, login, getProfile } from './controllers/auth';
import { verifyToken } from './middleware/auth';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

// Initialize Prisma client
export const prisma = new PrismaClient();

// Create Express app
export const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://googlehacka-p24bgpi3i-aryan-duttas-projects.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

// Custom logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Environment:', process.env.NODE_ENV);
  next();
});

app.use(morgan('dev'));

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => {
  console.log('Favicon request received');
  res.status(204).end();
});

// Root route handler with detailed logging
app.get('/', (req, res) => {
  console.log('Root route accessed');
  console.log('Request headers:', req.headers);
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  
  res.json({
    message: 'Digital Rights Tool API',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error occurred:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString()
  });
});

// Import routes
import uploadRoutes from './routes/upload';
import analysisRoutes from './routes/analysis';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Add multer middleware to upload route
app.use('/api/upload', (req, res, next) => {
  if (req.method === 'POST' && !req.path.startsWith('/:id')) {
    upload.single('file')(req, res, next);
  } else {
    next();
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analysis', analysisRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
}); 