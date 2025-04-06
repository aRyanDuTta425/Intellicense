import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { HTTPException } from 'hono/http-exception';
import { authRoutes } from './routes/auth';
import { uploadRoutes } from './routes/upload';
import { analysisRoutes } from './routes/analysis';
import { Env, Variables } from './types';

// Create Hono app
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

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

// Root route
app.get('/', (c) => c.json({
  status: 'ok',
  message: 'Digital Rights Tool API',
  version: '1.0.0',
  endpoints: {
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      profile: '/api/auth/profile'
    },
    uploads: {
      create: '/api/uploads',
      list: '/api/uploads',
      get: '/api/uploads/:id',
      delete: '/api/uploads/:id'
    },
    analyses: {
      create: '/api/analyses/:uploadId',
      get: '/api/analyses/:id',
      list: '/api/analyses',
      delete: '/api/analyses/:id'
    },
    health: '/api/health'
  }
}));

// Mount routes
app.route('/api/auth', authRoutes);
app.route('/api/uploads', uploadRoutes);
app.route('/api/analyses', analysisRoutes);

// Health check route
app.get('/api/health', (c) => c.json({ status: 'ok', message: 'Server is running' }));

// Error handling
app.onError((err, c) => {
  console.error(`[Error] ${err.message}`);
  if (err instanceof HTTPException) {
    return c.json({ 
      status: 'error',
      message: err.message
    }, err.status);
  }
  return c.json({ 
    status: 'error',
    message: 'Internal Server Error'
  }, 500);
});

// Not found handling
app.notFound((c) => {
  return c.json({ 
    status: 'error',
    message: 'Not Found'
  }, 404);
});

export default {
  fetch: app.fetch.bind(app),
}; 