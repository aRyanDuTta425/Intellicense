import { serve } from '@hono/node-server';
import app from './index';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

console.log(`Starting server on port ${PORT}...`);

serve({
  fetch: app.fetch,
  port: Number(PORT),
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
}); 