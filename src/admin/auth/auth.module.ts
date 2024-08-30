import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/GlobalService/password.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    PasswordService,
    LocalStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
