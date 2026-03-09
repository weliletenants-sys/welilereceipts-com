import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, InviteDto, Lc1Dto, LandlordDto, SmsOtpDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('invite')
  createInvite(@Req() req: Request & { user: any }, @Body() dto: InviteDto) {
    return this.authService.createInvite(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('lc1')
  registerLc1(@Body() dto: Lc1Dto) {
    return this.authService.registerLc1(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('landlord')
  registerLandlord(@Req() req: Request & { user: any }, @Body() dto: LandlordDto) {
    return this.authService.registerLandlord(req.user.sub, dto);
  }

  @Post('sms-otp')
  handleSmsOtp(@Body() dto: SmsOtpDto) {
    return this.authService.handleSmsOtp(dto);
  }
}
