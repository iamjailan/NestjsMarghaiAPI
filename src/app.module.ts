import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, AdminModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
