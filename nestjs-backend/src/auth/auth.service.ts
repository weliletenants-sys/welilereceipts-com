import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, InviteDto, Lc1Dto, LandlordDto, SmsOtpDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const existingProfile = await this.prisma.client.profiles.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }]
      }
    });

    if (existingProfile) {
      throw new ConflictException('User with this email or phone already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.client.profiles.create({
      data: {
        email: dto.email,
        full_name: dto.full_name,
        phone: dto.phone,
        password_hash: passwordHash,
        verified: true, // Auto-verified for now since OTPs are mocked
        is_frozen: false,
        rent_discount_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    });

    return {
      message: 'Registration successful!',
      user: { id: user.id, email: user.email, full_name: user.full_name }
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.client.profiles.findFirst({
      where: { email: dto.email }
    });

    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    
    if (!isMatch) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name
      }
    };
  }

  async createInvite(creatorId: string, dto: InviteDto) {
    return {
      message: '(MOCKED) Invite created successfully',
      activation_token: 'mock-token',
    };
  }

  async registerLc1(dto: Lc1Dto) {
    return {
      message: '(MOCKED) LC1 Registered!',
      activation_token: 'mock-token'
    };
  }

  async registerLandlord(creatorId: string, dto: LandlordDto) {
    return {
      message: '(MOCKED) Landlord Registered!',
      activation_token: 'mock-token'
    };
  }

  async handleSmsOtp(dto: SmsOtpDto) {
    if (dto.action === 'send') {
      console.log(`[NestJS MOCK OTP] Sent OTP code "123456" to ${dto.phone}`);
      return { message: 'OTP sent successfully', success: true };
    }

    if (dto.action === 'verify') {
      if (dto.otp === '123456') {
        return { message: 'OTP verified successfully', success: true };
      }
      throw new BadRequestException('Invalid OTP code');
    }

    throw new BadRequestException('Invalid action specified');
  }
}

