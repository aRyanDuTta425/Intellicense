import { Context } from 'hono';
import { generateToken, hashPassword, verifyPassword } from '../lib/crypto';
import { PrismaClient } from '@prisma/client';
import { Env, Variables } from '../types';

const prisma = new PrismaClient();

// Generate UUID using crypto module
import { randomUUID } from 'crypto';

// Register user
export async function register(c: Context<{ Bindings: Env; Variables: Variables }>) {
  try {
    const { email, password, name } = await c.req.json();
    console.log('Registration request body:', { email, name });

    // Validate required fields
    if (!email || !password) {
      return c.json({ message: 'Email and password are required' }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      console.log('Email validation failed. Received email:', email);
      return c.json({ 
        message: 'Invalid email format',
        details: 'Please provide a valid email address',
        receivedEmail: email
      }, 400);
    }

    // Check if user exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return c.json({ message: 'User already exists' }, 400);
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await hashPassword(password);
    console.log('Password hashed successfully');

    // Create user
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email,
        name: name || email.split('@')[0], // Use part before @ as name if not provided
        password: hashedPassword,
        role: 'USER',
      }
    });
    console.log('User created:', user);

    // Generate token
    console.log('Generating token...');
    const token = await generateToken(user, c.env.JWT_SECRET);
    console.log('Token generated successfully');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return c.json({ token, user: userWithoutPassword }, 201);
  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    return c.json({ 
      message: 'Registration failed', 
      error: error?.message || 'Unknown error',
      details: 'Please check your input and try again',
      stack: error.stack
    }, 500);
  }
}

// Login user
export async function login(c: Context<{ Bindings: Env; Variables: Variables }>) {
  try {
    const { email, password } = await c.req.json();
    console.log('Login request:', { email });

    // Get user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    // Verify password
    console.log('Verifying password...');
    const isValid = await verifyPassword(password, user.password);
    console.log('Password valid:', isValid);
    if (!isValid) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    // Generate token
    console.log('Generating token...');
    const token = await generateToken(user, c.env.JWT_SECRET);
    console.log('Token generated');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return c.json({ token, user: userWithoutPassword });
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json({ message: 'Login failed', error: error?.message || 'Unknown error' }, 500);
  }
}

// Get user profile
export async function getProfile(c: Context<{ Bindings: Env; Variables: Variables }>) {
  try {
    const userId = c.get('user')?.id;
    if (!userId) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    return c.json(user);
  } catch (error: any) {
    console.error('Profile error:', error);
    return c.json({ message: 'Failed to get profile', error: error?.message || 'Unknown error' }, 500);
  }
} 