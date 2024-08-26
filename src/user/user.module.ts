import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/GlobalService/password.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, PasswordService],
})
export class UserModule {}
