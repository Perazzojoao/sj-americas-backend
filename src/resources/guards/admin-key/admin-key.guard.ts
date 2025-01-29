import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<Request>();
    const adminKey = request.headers['admin-key'];
    const validAdminKey = this.configService.get<string>('ADMIN_SECRET_KEY');
    if (adminKey !== validAdminKey) {
      return false;
    }

    return true;
  }
}
