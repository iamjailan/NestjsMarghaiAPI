import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  Query,
  Put,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from './admin.guard';
import { Roles } from './role.decorator';

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly prismService: PrismaService,
  ) {}

  @Roles(['super_admin', 'admin'])
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    const isSuperAdmin = false;

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
      const admin = await this.prismService.admin.findUnique({
        where: { email: createAdminDto.email },
      });

      const superAdmin = await this.prismService.admin.findMany({
        where: { role: 'super_admin' },
      });

      if (admin) {
        throw new HttpException(
          'Email already exist please login',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (superAdmin.length > 0 && createAdminDto.role === 'super_admin') {
        throw new HttpException('Cannot Create super admin', 400);
      }

      if (!isSuperAdmin && createAdminDto.role === 'admin') {
        throw new HttpException(
          'You can only create Viewer!',
          HttpStatus.FORBIDDEN,
        );
      }

      const data = await this.adminService.create({ createAdminDto, fields });

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async findAll(
    @Query()
    {
      offset,
      limit,
      orderBy,
      sortBy,
    }: {
      offset: number;
      limit: number;
      orderBy: 'asc' | 'desc' | any;
      sortBy: string;
    },
  ) {
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

    offset = Number(offset) ? Number(offset) : 0;
    limit = Number(limit) ? Number(limit) : 10;

    sortBy = sortBy ? sortBy.toLowerCase() : 'id';
    orderBy = orderBy ? orderBy.toLowerCase() : 'desc';

    if (sortBy && !fields.includes(sortBy)) {
      throw new HttpException(
        `${sortBy} does not exit for filter in database`,
        422,
      );
    }

    if (orderBy !== 'asc' && orderBy !== 'desc') {
      throw new HttpException(`orderBy most be ast or desc`, 422);
    }

    try {
      const admin = await this.adminService.findAll({
        fields,
        offset,
        limit,
        orderBy,
        sortBy,
      });
      return {
        success: true,
        data: admin.data,
        limit,
        offset,
        count: admin.counts,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
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
      const admin = await this.prismService.admin.findUnique({
        where: { id: id },
      });
      if (!admin) {
        throw new HttpException('Admin not found', 404);
      }
      const data = await this.adminService.findOne({ id, fields });
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Roles(['super_admin'])
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
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
      const admin = await this.prismService.admin.findUnique({
        where: { id: id },
      });

      const adminByEmail = await this.prismService.admin.findUnique({
        where: { email: updateAdminDto.email },
      });

      if (!admin) {
        throw new HttpException('Admin not found', 404);
      }

      if (adminByEmail && adminByEmail.email !== admin.email) {
        throw new HttpException('Email already take!', 400);
      }

      if (updateAdminDto.role === 'super_admin') {
        throw new HttpException(
          'Cannot change status to super admin!',
          HttpStatus.FORBIDDEN,
        );
      }

      const data = await this.adminService.update({
        id,
        fields,
        updateAdminDto,
      });

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Roles(['super_admin'])
  @Delete(':id')
  async remove(@Param('id') id: string) {
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
      const admin = await this.prismService.admin.findUnique({
        where: { id: id },
      });
      if (!admin) {
        throw new HttpException('Admin not found', 404);
      }

      if (admin.role === 'super_admin') {
        throw new HttpException(
          'Cannot delete super admin!',
          HttpStatus.FORBIDDEN,
        );
      }

      const data = await this.adminService.remove({ id, fields });
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
