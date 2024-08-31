import {
  Controller,
  Get,
  Body,
  Delete,
  Request,
  UseGuards,
  NotFoundException,
  HttpException,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import { MeService } from './me.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@UseGuards(AuthenticatedGuard)
@Controller('/admin/me/route')
export class MeController {
  constructor(
    private readonly meService: MeService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async findOne(@Request() request) {
    const id = request.user.id;

    const fields = [
      'id',
      'created_at',
      'updated_at',
      'user_name',
      'last_name',
      'age',
      'country',
      'city',
      'address',
      'email',
      'profile_picture',
      'gender',
      'phone_number',
      'role',
      'bio',
      'admin_handle',
    ];

    try {
      const admin = await this.prismaService.admin.findUnique({
        where: { id: id },
      });

      if (!admin) {
        throw new NotFoundException();
      }
      const adminById = await this.meService.findOne({
        id,
        fields,
      });
      return {
        success: true,
        data: adminById,
      };
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Put()
  async update(@Body() updateMeDto: UpdateMeDto, @Request() request) {
    const id = request.user.id;

    const fields = [
      'id',
      'created_at',
      'updated_at',
      'user_name',
      'last_name',
      'age',
      'country',
      'city',
      'address',
      'email',
      'profile_picture',
      'gender',
      'phone_number',
      'role',
      'bio',
      'admin_handle',
    ];
    try {
      const admin = await this.prismaService.admin.findUnique({
        where: { id },
      });
      if (!admin) {
        throw new NotFoundException();
      }
      const updatedAdmin = await this.meService.update({
        id,
        fields,
        updateMeDto,
      });
      return {
        success: true,
        data: updatedAdmin,
      };
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Delete()
  async remove(@Request() request) {
    const id = request.user.id;
    const role = request.user.role;

    if (role === 'super_admin') {
      throw new ForbiddenException();
    }

    const fields = [
      'id',
      'created_at',
      'updated_at',
      'user_name',
      'last_name',
      'age',
      'country',
      'city',
      'address',
      'email',
      'profile_picture',
      'gender',
      'phone_number',
      'role',
      'bio',
      'admin_handle',
    ];

    try {
      const admin = await this.prismaService.admin.findUnique({
        where: { id },
      });
      if (!admin) {
        throw new NotFoundException();
      }
      const deletedAdmin = await this.meService.remove({
        id,
        fields,
      });
      return {
        success: true,
        data: deletedAdmin,
      };
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }
}
