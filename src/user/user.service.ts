import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaSelect } from 'utils/createPrismaSelect';
import createObjectFromArray from 'utils/createObjectFromArray';

@Injectable()
export class UserService {
  constructor(readonly prismaService: PrismaService) {}
  async create({
    userData,
    fields,
  }: {
    userData: CreateUserDto;
    fields: string[];
  }) {
    const user = await this.prismaService.user.create({
      data: userData,
      select: createPrismaSelect(fields),
    });
    return user;
  }

  async findAll({
    fields,
    limit,
    offset,
    orderBy,
    sortBy,
  }: {
    fields: string[];
    limit: number;
    offset: number;
    sortBy: string;
    orderBy: 'asc' | 'desc';
  }) {
    try {
      const [data, count] = await this.prismaService.$transaction([
        this.prismaService.user.findMany({
          take: limit,
          skip: offset,
          select: createPrismaSelect(fields),
          orderBy: createObjectFromArray([sortBy], orderBy),
        }),
        this.prismaService.user.count(),
      ]);
      return { data, count };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ? error.statusCode : HttpStatus.FORBIDDEN,
      );
    }
  }

  async findOne({ id, fields }: { id: string; fields: string[] }) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: id },
        select: createPrismaSelect(fields),
      });
      return user;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ? error.statusCode : HttpStatus.FORBIDDEN,
      );
    }
  }

  async update({
    id,
    updateUserDto,
    fields,
  }: {
    id: string;
    updateUserDto: UpdateUserDto;
    fields: string[];
  }) {
    try {
      const user = await this.prismaService.user.update({
        data: updateUserDto,
        where: { id: id },
        select: createPrismaSelect(fields),
      });
      return user;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ? error.statusCode : HttpStatus.FORBIDDEN,
      );
    }
  }

  async remove({ id, fields }: { id: string; fields: string[] }) {
    try {
      const user = await this.prismaService.user.delete({
        where: { id: id },
        select: createPrismaSelect(fields),
      });
      return user;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ? error.statusCode : HttpStatus.FORBIDDEN,
      );
    }
  }
}
