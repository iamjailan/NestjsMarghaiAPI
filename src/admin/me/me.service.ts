import { HttpException, Injectable } from '@nestjs/common';
import { CreateMeDto } from './dto/create-me.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaSelect } from 'utils/createPrismaSelect';

@Injectable()
export class MeService {
  constructor(private readonly prismaService: PrismaService) {}
  async findOne({ id, fields }: { id: string; fields: string[] }) {
    try {
      const admin = await this.prismaService.admin.findUnique({
        where: { id: id },
        select: createPrismaSelect(fields),
      });
      return admin;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  async update({
    id,
    updateMeDto,
    fields,
  }: {
    id: string;
    updateMeDto: UpdateMeDto;
    fields: string[];
  }) {
    try {
      const admin = await this.prismaService.admin.update({
        where: { id },
        data: updateMeDto,
        select: createPrismaSelect(fields),
      });
      return admin;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  async remove({ id, fields }: { id: string; fields: string[] }) {
    try {
      const admin = await this.prismaService.admin.delete({
        where: { id },
        select: createPrismaSelect(fields),
      });
      return admin;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }
}
