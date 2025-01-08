import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventAbstractRepository } from './repositories/event-abstract.repository';
import { EventRepository } from './repositories/event.repository';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [EventController],
  providers: [
    EventService,
    {
      provide: EventAbstractRepository,
      useClass: EventRepository,
    },
    DatabaseService,
  ],
})
export class EventModule {}
