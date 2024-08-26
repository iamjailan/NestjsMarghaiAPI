import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

enum GENDER {
  male = 'male',
  female = 'female',
  other = 'other',
}
enum Role {
  super_admin = 'super_admin',
  admin = 'admin',
  viewer = 'viewer',
}

export class CreateAdminDto {
  @IsString()
  user_name: string;

  @IsString()
  last_name: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsDateString()
  @IsOptional()
  date_of_birth: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  profile_picture: string;

  @IsEnum(GENDER)
  @IsOptional()
  gender: GENDER;

  @IsPhoneNumber()
  @IsOptional()
  phone_number: string;

  @IsEmail()
  email: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;

  @IsString()
  password: string;
}
