import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Env, Variables } from '../types';

const prisma = new PrismaClient();

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function verifyToken(c: Context<{ Bindings: Env; Variables: Variables }>, next: Next) {
  // Mock user for development
  const mockUser = {
    id: 'mock-user-id',
    email: 'mock@example.com',
    name: 'Mock User',
    role: 'USER'
  };
  
  // Set mock user in context
  c.set('user', mockUser);
  
  // Continue to the next middleware/handler
  await next();
  
  /* Original code commented out
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ message: 'No token provided' }, 401);
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
      return c.json({ message: 'No token provided' }, 401);
    }

    const decoded = jwt.verify(token, c.env.JWT_SECRET) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return c.json({ message: 'Invalid token' }, 401);
    }

    // Set user in context
    c.set('user', user);
    
    // Continue to the next middleware/handler
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ message: 'Invalid token' }, 401);
  }
  */
} 