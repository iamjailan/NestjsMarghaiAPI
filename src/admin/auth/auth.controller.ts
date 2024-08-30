import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/GlobalService/password.service';
import { LocalGuard } from './admin.guard';

@Controller('*/auth')
@UseGuards(LocalGuard)
export class AuthController {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly passwordService: PasswordService,
  ) {}

  @Post()
  async create(@Request() request) {
    try {
      return request.user;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
