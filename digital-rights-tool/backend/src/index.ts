import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { serveStatic } from 'hono/cloudflare-workers';
import { PrismaClient } from '@prisma/client';
import { register, login, getProfile } from './controllers/auth';
import { verifyToken } from './middleware/auth';
import { authRoutes } from './routes/auth';
import { uploadRoutes } from './routes/upload';
import { analysisRoutes } from './routes/analysis';
import requestRoutes from './routes/request';

// Initialize Prisma client
export const prisma = new PrismaClient();

// Create Hono app
const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use(cors({
  origin: (origin) => {
    // Allow all origins by returning the origin itself
    return origin;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposeHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
}));

// Root route handler
app.get('/', (c) => {
  console.log('Root route accessed');
  return c.json({
    message: 'Digital Rights Tool API',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Health check route
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/uploads', uploadRoutes);
app.route('/api/analyses', analysisRoutes);
app.route('/api/requests', requestRoutes);

// Serve static files - commented out for local development
// app.use('/uploads/*', serveStatic({ root: './uploads' }));

// Error handling
app.onError((err, c) => {
  console.error('Error occurred:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  }, 500);
});

// 404 handler
app.notFound((c) => {
  console.log('404 Not Found:', c.req.method, c.req.url);
  return c.json({
    error: 'Not Found',
    message: `Route ${c.req.method} ${c.req.url} not found`,
    timestamp: new Date().toISOString()
  }, 404);
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

// Export for both Node.js and Cloudflare Workers
export default app; 