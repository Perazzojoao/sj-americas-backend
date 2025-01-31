import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard, RequestWithUser } from '../auth.guard';

@Injectable()
export class SuperAdminOnlyGuard extends AuthGuard implements CanActivate {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<RequestWithUser>();
    const token = this.getToken(request);
    if (!token) {
      throw new UnauthorizedException('Authentication error');
    }

    const payload = await this.validateToken(token);
    request.user = payload;

    const params = request.params;
    const id = parseInt(params.id, 10);
    if (id === payload.sub) {
      return true;
    }

    if (payload.role !== 'ADMIN' || payload.user_name !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
