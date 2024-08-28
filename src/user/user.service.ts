import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaSelect } from 'utils/createPrismaSelect';
import createObjectFromArray from 'utils/createObjectFromArray';
import { PasswordService } from 'src/GlobalService/password.service';

@Injectable()
export class UserService {
  constructor(
    readonly prismaService: PrismaService,
    readonly passwordService: PasswordService,
  ) {}
  async create({
    userData,
    fields,
  }: {
    userData: CreateUserDto;
    fields: string[];
  }) {
    const {
      address,
      age,
      bio,
      city,
      country,
      date_of_birth,
      email,
      gender,
      last_name,
      phone_number,
      profile_picture,
      user_name,
    } = userData;
    const user = await this.prismaService.user.create({
      data: {
        address,
        age,
        bio,
        city,
        country,
        date_of_birth,
        email,
        gender,
        last_name,
        phone_number,
        profile_picture,
        user_name,
        password: await this.passwordService.hashPassword(userData.password),
      },
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
    const {
      address,
      age,
      bio,
      city,
      country,
      date_of_birth,
      email,
      gender,
      last_name,
      phone_number,
      profile_picture,
      user_name,
    } = updateUserDto;
    try {
      const user = await this.prismaService.user.update({
        data: {
          address,
          age,
          bio,
          city,
          country,
          date_of_birth,
          email,
          gender,
          last_name,
          phone_number,
          profile_picture,
          user_name,
          password: await this.passwordService.hashPassword(
            updateUserDto.password,
          ),
        },
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
