import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class InviteDto {
  @IsString()
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  isSubAgent?: boolean;
  isSupporter?: boolean;
  latitude?: number;
  longitude?: number;
  locationAccuracy?: number;
  propertyAddress?: string;
  numberOfRentals?: number;
  houseCategory?: string;
  momoName?: string;
  momoNumber?: string;
  nwscMeter?: string;
  uedclMeter?: string;
}

export class Lc1Dto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  village: string;
}

export class LandlordDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  property_address: string;

  @IsString()
  temp_password: string;

  tenant_id?: string;
  latitude?: number;
  longitude?: number;
  location_captured_at?: string;
  mobile_money_name?: string;
  mobile_money_number?: string;
  water_meter_number?: string;
  electricity_meter_number?: string;
  number_of_houses?: number;
  house_category?: string;
}

export class SmsOtpDto {
  @IsString()
  @IsNotEmpty()
  action: 'send' | 'verify';

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  otp?: string;
}
