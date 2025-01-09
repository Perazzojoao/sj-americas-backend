import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventAbstractRepository } from './repositories/event-abstract.repository';
import { EventRepository } from './repositories/event.repository';
import { TablesModule } from '../tables/tables.module';

@Module({
  imports: [TablesModule],
  controllers: [EventController],
  providers: [
    EventService,
    {
      provide: EventAbstractRepository,
      useClass: EventRepository,
    },
  ],
})
export class EventModule {}
