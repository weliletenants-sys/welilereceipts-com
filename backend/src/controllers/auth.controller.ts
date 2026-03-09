import { Request, Response } from 'express';
import prisma from '../db';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.utils';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(2),
  phone: z.string().min(5)
});

export const register = async (req: Request, res: Response) => {
  try {
    const parsedData = registerSchema.parse(req.body);
    const { email, password, full_name, phone } = parsedData;

    // Check if user already exists
    const existingUser = await prisma.profiles.findFirst({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create UUID for the new user
    const userId = crypto.randomUUID();

    await prisma.profiles.create({
      data: {
        id: userId,
        email,
        full_name,
        phone,
        password_hash: hashedPassword,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_frozen: false,
        verified: false,
        rent_discount_active: false
      }
    });

    return res.status(201).json({ 
      message: 'Registration successful!',
      user: { id: userId, email, full_name }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const login = async (req: Request, res: Response) => {
  try {
    const parsedData = loginSchema.parse(req.body);
    const { email, password } = parsedData;

    const profile = await prisma.profiles.findFirst({
      where: { email }
    });

    if (!profile || !profile.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, profile.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(profile.id, 'tenant'); // default role placeholder

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: profile.id,
        email: email,
        full_name: profile.full_name
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
};
