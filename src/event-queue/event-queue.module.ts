import { Module } from '@nestjs/common';
import { EventQueueService } from './event-queue.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'EVENT_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get<string>('EVENT_SERVICE_URL')}`],
            queue: configService.get<string>('EVENT_SERVICE_QUEUE'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [EventQueueService],
  exports: [EventQueueService],
})
export class EventQueueModule {}
