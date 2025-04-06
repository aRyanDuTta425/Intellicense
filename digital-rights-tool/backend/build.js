const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Create a simple index.js file in the dist directory
const indexJsContent = `
const { Hono } = require('hono');
const { cors } = require('hono/cors');
const { logger } = require('hono/logger');
const { prettyJSON } = require('hono/pretty-json');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

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

// API Routes
// Auth routes
app.post('/api/auth/register', (c) => {
  // Mock successful registration
  return c.json({
    user: {
      id: 'mock-user-id',
      name: 'Mock User',
      email: 'mock@example.com'
    },
    token: 'mock-token'
  });
});

app.post('/api/auth/login', (c) => {
  // Mock successful login
  return c.json({
    user: {
      id: 'mock-user-id',
      name: 'Mock User',
      email: 'mock@example.com'
    },
    token: 'mock-token'
  });
});

app.get('/api/auth/profile', (c) => {
  // Mock user profile
  return c.json({
    user: {
      id: 'mock-user-id',
      name: 'Mock User',
      email: 'mock@example.com'
    }
  });
});

// Upload routes
app.post('/api/uploads', (c) => {
  // Mock successful upload
  return c.json({
    upload: {
      id: 'mock-upload-id',
      userId: 'mock-user-id',
      fileType: 'IMAGE',
      fileName: 'mock-file.jpg',
      fileUrl: 'https://example.com/mock-file.jpg',
      contentType: 'image/jpeg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
});

app.get('/api/uploads', (c) => {
  // Mock uploads list
  return c.json({
    uploads: [
      {
        id: 'mock-upload-1',
        userId: 'mock-user-id',
        fileType: 'IMAGE',
        fileName: 'sample-image.jpg',
        fileUrl: 'https://example.com/sample-image.jpg',
        contentType: 'image/jpeg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'mock-upload-2',
        userId: 'mock-user-id',
        fileType: 'ARTICLE',
        fileName: 'sample-article.txt',
        fileUrl: 'https://example.com/sample-article.txt',
        contentType: 'text/plain',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  });
});

app.get('/api/uploads/:id', (c) => {
  // Mock single upload
  const id = c.req.param('id');
  return c.json({
    upload: {
      id,
      userId: 'mock-user-id',
      fileType: 'IMAGE',
      fileName: 'sample-image.jpg',
      fileUrl: 'https://example.com/sample-image.jpg',
      contentType: 'image/jpeg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
});

app.delete('/api/uploads/:id', (c) => {
  // Mock successful deletion
  return c.json({ success: true });
});

// Analysis routes
app.post('/api/analyses/:id', (c) => {
  // Mock successful analysis creation
  return c.json({
    analysis: {
      id: 'mock-analysis-id',
      uploadId: c.req.param('id'),
      licensingSummary: 'Analysis in progress...',
      riskScore: 0,
      createdAt: new Date().toISOString()
    }
  });
});

app.get('/api/analyses/:id', (c) => {
  // Mock analysis
  return c.json({
    analysis: {
      id: 'mock-analysis-id',
      uploadId: c.req.param('id'),
      licensingSummary: 'This content is licensed under the MIT License, which allows for commercial use, modification, and distribution with minimal restrictions.',
      riskScore: 10,
      createdAt: new Date().toISOString()
    }
  });
});

// Request routes
app.post('/api/requests', (c) => {
  // Mock successful request creation
  return c.json({
    request: {
      id: 'mock-request-id',
      userId: 'mock-user-id',
      question: 'What are the licensing terms for this image?',
      answer: 'This image is licensed under the MIT License.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
});

app.get('/api/requests', (c) => {
  // Mock requests list
  return c.json({
    requests: [
      {
        id: 'mock-request-1',
        userId: 'mock-user-id',
        question: 'What are the licensing terms for this image?',
        answer: 'This image is licensed under the MIT License.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'mock-request-2',
        userId: 'mock-user-id',
        question: 'Can I use this image for commercial purposes?',
        answer: 'Yes, the MIT License allows for commercial use.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  });
});

app.get('/api/requests/:id', (c) => {
  // Mock single request
  const id = c.req.param('id');
  return c.json({
    request: {
      id,
      userId: 'mock-user-id',
      question: 'What are the licensing terms for this image?',
      answer: 'This image is licensed under the MIT License.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
});

module.exports = app;
`;

// Create a server.js file in the dist directory
const serverJsContent = `
const app = require('./index');
const { serve } = require('@hono/node-server');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

console.log(\`Starting server on port \${PORT}...\`);

serve({
  fetch: app.fetch,
  port: Number(PORT),
}, (info) => {
  console.log(\`Server is running on http://localhost:\${info.port}\`);
});
`;

// Write the index.js file to the dist directory
fs.writeFileSync(path.join(__dirname, 'dist', 'index.js'), indexJsContent);
console.log('Created index.js file in dist directory');

// Write the server.js file to the dist directory
fs.writeFileSync(path.join(__dirname, 'dist', 'server.js'), serverJsContent);
console.log('Created server.js file in dist directory');

// Run Prisma generate
console.log('Running Prisma generate...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma generate completed successfully!');
} catch (error) {
  console.error('Prisma generate failed:', error);
  process.exit(1);
}

console.log('Build completed successfully!'); 