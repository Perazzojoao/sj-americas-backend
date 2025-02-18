import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { yellow } from 'colors';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { RequestWithUser } from 'src/resources/guards/auth.guard';
import {
  EventQueueService,
  ISendEvent,
} from 'src/event-queue/event-queue.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly eventQueueService: EventQueueService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request | RequestWithUser>();
    const userAgent = request.get('user-agent') || '';
    const { ip } = request;
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const timeToProcess = Date.now() - now;
        this.logger.log(
          `${'user' in request ? ` User ID: ${request.user.sub} - ` : ''}${userAgent} ${ip}: ${request.method} ${request.url} ` +
            yellow(`+${timeToProcess}ms`),
          'Logger',
        );

        const { password, ...body } = request.body;
        const queueData: ISendEvent = {
          userId: 'user' in request ? request.user.sub : undefined,
          userAgent,
          ip,
          requestMethod: request.method,
          url: request.url,
          timeToProcess,
          data: request.body ? JSON.stringify(body) : undefined,
        };
        this.eventQueueService.sendEvent(queueData);
      }),
    );
  }
}
