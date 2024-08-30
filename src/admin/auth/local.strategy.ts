import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { PasswordService } from 'src/GlobalService/password.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordService: PasswordService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const admin = await this.authService.validateAdmin(email);

    if (!admin) throw new UnauthorizedException();

    const comparePasswords = await this.passwordService.comparePasswords(
      password,
      admin.password,
    );

    if (!comparePasswords) throw new UnauthorizedException();

    const { password: adminPassword, ...adminData } = admin;

    return adminData;
  }
}
