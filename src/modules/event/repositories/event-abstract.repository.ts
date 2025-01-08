import { EventEntity } from '../entities/event.entity';

export abstract class EventAbstractRepository {
  abstract createEvent(
    eventEntity: EventEntity,
    tables: number,
  ): Promise<EventEntity>;
  abstract findAllEvents(): Promise<EventEntity[]>;
  abstract findEventById(id: number): Promise<EventEntity>;
  abstract updateEvent(
    id: number,
    eventEntity: EventEntity,
  ): Promise<EventEntity>;
  abstract removeEvent(id: number): Promise<EventEntity>;
}
