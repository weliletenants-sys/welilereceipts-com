import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../prisma/prisma.client';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, phone } = req.body;

    if (!email || !firstName || !lastName || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await prisma.profiles.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const now = new Date().toISOString();

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Create Profile
    const profile = await prisma.profiles.create({
      data: {
        email,
        full_name: `${firstName} ${lastName}`,
        phone: phone || '0000000000',
        password_hash,
        is_frozen: false,
        verified: false,
        rent_discount_active: false,
        created_at: now,
        updated_at: now,
      },
    });

    // Create Role
    await prisma.userRoles.create({
      data: {
        role: role,
        user_id: profile.id,
        enabled: true,
        created_at: now
      }
    });

    // Create Wallet
    await prisma.wallets.create({
      data: {
        balance: 0.00,
        user_id: profile.id,
        created_at: now,
        updated_at: now
      }
    });

    const payload = { email: profile.email, sub: profile.id, role: role };
    const access_token = jwt.sign(payload, JWT_SECRET);

    return res.status(201).json({
      access_token,
      user: {
        id: profile.id,
        email: profile.email,
        firstName,
        lastName,
        role,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, phone, password } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: 'Missing email or phone' });
    }

    const profile = await prisma.profiles.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      }
    });

    if (!profile) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!profile.password_hash) {
      return res.status(401).json({ message: 'Please reset your password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, profile.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userRole = await prisma.userRoles.findFirst({ where: { user_id: profile.id } });
    const role = userRole ? userRole.role : 'TENANT';

    const payload = { email: profile.email, sub: profile.id, role };
    const access_token = jwt.sign(payload, JWT_SECRET);

    return res.status(200).json({
      access_token,
      user: {
        id: profile.id,
        email: profile.email,
        firstName: profile.full_name.split(' ')[0],
        lastName: profile.full_name.split(' ').slice(1).join(' '),
        role,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    const otp_code = '1234'; // Mocked OTP for demo purposes
    const now = new Date();
    const expires_at = new Date(now.getTime() + 10 * 60000).toISOString(); // 10 mins expiry

    await prisma.otpVerifications.create({
      data: {
        phone,
        otp_code,
        attempts: 0,
        verified: false,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        expires_at
      }
    });

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp_code } = req.body;
    if (!phone || !otp_code) return res.status(400).json({ message: 'Phone and OTP are required' });

    const verification = await prisma.otpVerifications.findFirst({
      where: { phone, otp_code, verified: false },
      orderBy: { created_at: 'desc' },
    });

    if (!verification) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (new Date(verification.expires_at) < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    await prisma.otpVerifications.update({
      where: { id: verification.id },
      data: { verified: true, verified_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    });

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const profile = await prisma.profiles.findFirst({ where: { id: decoded.sub } });
    if (!profile) return res.status(404).json({ message: 'User not found' });
    
    const userRole = await prisma.userRoles.findFirst({ where: { user_id: profile.id } });
    const role = userRole ? userRole.role : 'TENANT';
    
    return res.status(200).json({
      data: {
        id: profile.id,
        email: profile.email,
        phone: profile.phone,
        firstName: profile.full_name.split(' ')[0],
        lastName: profile.full_name.split(' ').slice(1).join(' '),
        role,
        roles: [role]
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const getUserRoles = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    
    const userRoles = await prisma.userRoles.findMany({
      where: { user_id: userId },
      select: { role: true }
    });
    
    return res.status(200).json(userRoles);
  } catch (error) {
    console.error('Get roles error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
