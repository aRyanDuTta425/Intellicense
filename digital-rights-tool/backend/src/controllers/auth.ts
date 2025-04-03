import { Request, Response } from 'express';
import { generateToken, hashPassword, verifyPassword } from '../lib/crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate UUID using crypto module
import { randomUUID } from 'crypto';

// Register user
export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    console.log('Registration request body:', { email, name });

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ 
        message: 'Invalid email format',
        details: 'Please provide a valid email address',
        receivedEmail: email
      });
    }

    // Check if user exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
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
    const token = await generateToken(user, process.env.JWT_SECRET!);
    console.log('Token generated successfully');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({ token, user: userWithoutPassword });
  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      message: 'Registration failed', 
      error: error?.message || 'Unknown error',
      details: 'Please check your input and try again',
      stack: error.stack
    });
  }
}

// Login user
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    console.log('Login request:', { email });

    // Get user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    console.log('Verifying password...');
    const isValid = await verifyPassword(password, user.password);
    console.log('Password valid:', isValid);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    console.log('Generating token...');
    const token = await generateToken(user, process.env.JWT_SECRET!);
    console.log('Token generated');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.json({ token, user: userWithoutPassword });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed', error: error?.message || 'Unknown error' });
  }
}

// Get user profile
export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
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
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error: any) {
    console.error('Profile error:', error);
    return res.status(500).json({ message: 'Failed to get profile', error: error?.message || 'Unknown error' });
  }
} 