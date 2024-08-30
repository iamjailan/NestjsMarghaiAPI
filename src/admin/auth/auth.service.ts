import { HttpException, Injectable } from '@nestjs/common';
import { AuthDTO } from './dto/login-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaSelect } from 'utils/createPrismaSelect';
import { PasswordService } from 'src/GlobalService/password.service';

@Injectable()
export class AuthService {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly passwordService: PasswordService,
  ) {}
  async validateAdmin(email) {
    try {
      const user = await this.prismaService.admin.findUnique({
        where: { email: email },
      });

      return user;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }
}
