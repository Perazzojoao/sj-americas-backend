import { EventEntity } from '../entities/event.entity';

export abstract class EventAbstractRepository {
  abstract createEvent(
    eventEntity: EventEntity,
    tables: number,
  ): Promise<EventEntity>;
  abstract findAllEvents(): Promise<EventEntity[]>;
  abstract findEventById(id: number, includeTables?: boolean): Promise<EventEntity>;
  abstract updateEvent(
    id: number,
    eventEntity: EventEntity,
  ): Promise<EventEntity>;
  abstract addTables(eventId: number, quantity: number): Promise<void>;
  abstract removeTables(eventId: number, quantity: number): Promise<void>
  abstract removeEvent(id: number): Promise<EventEntity>;
}
