import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const fields: string[] = [
      'user_name',
      'last_name',
      'date_of_birth',
      'age',
      'profile_picture',
      'gender',
      'email',
      'phone_number',
      'city',
      'country',
      'bio',
    ];
    const user = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new HttpException('User already exist please login instead', 400);
    }

    return this.userService.create({ userData: createUserDto, fields: fields });
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
      sortBy: string;
      orderBy: 'asc' | 'desc' | string;
    },
  ) {
    offset = Number(offset) ? Number(offset) : 0;
    limit = Number(limit) ? Number(limit) : 10;

    sortBy = sortBy ? sortBy.toLowerCase() : 'id';
    orderBy = orderBy ? orderBy.toLowerCase() : 'desc';

    const fields: string[] = [
      'id',
      'user_name',
      'last_name',
      'date_of_birth',
      'age',
      'profile_picture',
      'gender',
      'email',
      'phone_number',
      'city',
      'country',
      'bio',
    ];
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
      const userData = await this.userService.findAll({
        fields,
        offset,
        limit,
        orderBy,
        sortBy,
      });

      return {
        success: true,
        data: userData.data,
        limit: limit,
        offset: offset,
        count: userData.count,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ? error.statusCode : 400,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const fields: string[] = [
      'id',
      'user_name',
      'last_name',
      'date_of_birth',
      'age',
      'profile_picture',
      'gender',
      'email',
      'phone_number',
      'city',
      'country',
      'bio',
    ];
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: id },
      });

      if (!user) {
        throw new HttpException(
          { message: 'User not found!', status: 404 },
          HttpStatus.NOT_FOUND,
        );
      }
      const userById = await this.userService.findOne({ fields, id });

      return {
        success: true,
        data: userById,
      };
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const fields: string[] = [
      'id',
      'user_name',
      'last_name',
      'date_of_birth',
      'age',
      'profile_picture',
      'gender',
      'email',
      'phone_number',
      'city',
      'country',
      'bio',
    ];

    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: id },
      });
      if (!user) {
        throw new HttpException('User not found', 404);
      }
      const updatedUser = await this.userService.update({
        fields,
        id,
        updateUserDto,
      });

      return {
        success: true,
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const fields: string[] = [
      'id',
      'user_name',
      'last_name',
      'date_of_birth',
      'age',
      'profile_picture',
      'gender',
      'email',
      'phone_number',
      'city',
      'country',
      'bio',
    ];
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: id },
      });

      if (!user) {
        throw new HttpException('User Not Found', 404);
      }

      const deletedUser = await this.userService.remove({ fields, id });

      return {
        success: true,
        data: deletedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }
}
