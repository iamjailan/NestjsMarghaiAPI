import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MeController],
  providers: [MeService, PrismaService],
})
export class MeModule {}
