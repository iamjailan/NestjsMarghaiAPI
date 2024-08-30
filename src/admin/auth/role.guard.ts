import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './role.decorator';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private refactor: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.refactor.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (roles.includes(user?.role)) return true;
    throw new HttpException(
      'Not allowed to access this route!',
      HttpStatus.FORBIDDEN,
    );
  }
}
