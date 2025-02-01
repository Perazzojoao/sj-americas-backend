import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload, JwtTokenService } from 'src/jwt/jwt-token.service';
import { Request } from 'express';
import { $Enums } from '@prisma/client';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<RequestWithUser>();
    const isAdminOnly = this.reflector.get<boolean>(
      'admin-only',
      context.getClass(),
    );

    if (isAdminOnly) {
      const token = this.getToken(request);
      if (!token) {
        throw new UnauthorizedException('Authentication error');
      }

      const payload = await this.validateToken(token);
      request.user = payload;

      if (payload.role === $Enums.Role.USER) {
        throw new UnauthorizedException('Unauthorized access');
      }
    }

    if (request.method === 'GET') {
      return true;
    }

    const ignore = this.reflector.get<boolean>(
      'public-route',
      context.getHandler(),
    );
    if (ignore) {
      return true;
    }

    const token = this.getToken(request);
    if (!token) {
      throw new UnauthorizedException('Authentication error');
    }

    const payload = await this.validateToken(token);
    request.user = payload;

    return true;
  }

  getToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      return;
    }

    return token;
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtTokenService.verifyToken(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
