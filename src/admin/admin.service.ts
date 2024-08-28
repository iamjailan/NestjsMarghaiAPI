import { HttpException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaSelect } from 'utils/createPrismaSelect';
import { generateUserIdentifier } from 'utils/generateRandomText';
import createObjectFromArray from 'utils/createObjectFromArray';
import { PasswordService } from 'src/GlobalService/password.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async create({
    createAdminDto,
    fields,
  }: {
    createAdminDto: CreateAdminDto;
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
      role,
      user_name,
      password,
    } = createAdminDto;
    const admin = await this.prismaService.admin.create({
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
        role,
        user_name,
        admin_handle: generateUserIdentifier(user_name, last_name),
        password: await this.passwordService.hashPassword(password),
      },
      select: createPrismaSelect(fields),
    });
    return admin;
  }

  async findAll({
    fields,
    offset,
    limit,
    orderBy,
    sortBy,
  }: {
    fields: string[];
    offset: number;
    limit: number;
    orderBy: 'asc' | 'asc';
    sortBy: string;
  }) {
    try {
      const [data, counts] = await this.prismaService.$transaction([
        this.prismaService.admin.findMany({
          select: createPrismaSelect(fields),
          take: limit,
          skip: offset,
          orderBy: createObjectFromArray([sortBy], orderBy),
        }),
        this.prismaService.admin.count(),
      ]);

      return {
        counts,
        data,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ? error.statusCode : 400,
      );
    }
  }

  async findOne({ id, fields }: { id: string; fields: string[] }) {
    try {
      const data = await this.prismaService.admin.findUnique({
        where: { id },
        select: createPrismaSelect(fields),
      });

      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ? error.statusCode : 400,
      );
    }
  }

  async update({
    id,
    updateAdminDto,
    fields,
  }: {
    id: string;
    updateAdminDto: UpdateAdminDto;
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
      role,
      user_name,
      password,
    } = updateAdminDto;

    try {
      const encryptedPassword =
        await this.passwordService.hashPassword(password);

      const data = await this.prismaService.admin.update({
        where: { id },
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
          role,
          user_name,
          password: encryptedPassword,
        },
        select: createPrismaSelect(fields),
      });
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ? error.statusCode : 400,
      );
    }
  }

  async remove({ id, fields }: { id: string; fields: string[] }) {
    try {
      const data = await this.prismaService.admin.delete({
        where: { id },
        select: createPrismaSelect(fields),
      });
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ? error.statusCode : 400,
      );
    }
  }
}
