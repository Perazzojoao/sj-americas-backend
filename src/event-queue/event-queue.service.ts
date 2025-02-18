import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

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
  constructor(
    @Inject('EVENT_SERVICE') private readonly queueClient: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.queueClient.connect();
  }

  sendEvent(data: ISendEvent) {
    return this.queueClient.emit('log', data);
  }
}
