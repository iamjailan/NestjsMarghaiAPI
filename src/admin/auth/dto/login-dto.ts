import { IsEmail, IsString } from 'class-validator';

export class AuthDTO {
  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
