import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, lastValueFrom, timeout } from 'rxjs';

export interface ISendEvent {
  userId: number | string | undefined;
  userAgent: string;
  ip: string;
  requestMethod: string;
  url: string;
  timeToProcess: number;
  data: string;
}

@Injectable()
export class EventQueueService implements OnModuleInit {
  private readonly logger = new Logger(EventQueueService.name);

  constructor(
    @Inject('EVENT_SERVICE') private readonly queueClient: ClientProxy,
  ) {}

  async onModuleInit() {
    try {
      await this.queueClient.connect();
    } catch (error) {
      this.logger.error('Failed to connect to event service:', error);
    }
  }

  async sendEvent(data: ISendEvent) {
    if (data.userId === undefined) {
      return;
    }
    try {
      const result = this.queueClient.emit('log', data);
      await lastValueFrom(
        result.pipe(
          catchError(error => {
            this.logger.error('Failed to send event:', error);
            throw error;
          })
        )
      );
    } catch (error) {
      this.logger.error('Error in sendEvent:', error);
    }
  }
}
