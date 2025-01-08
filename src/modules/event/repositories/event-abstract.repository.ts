import { EventEntity } from "../entities/event.entity";

export abstract class EventAbstractRepository {
  abstract createEvent(eventEntity: EventEntity): Promise<EventEntity>;
  abstract findAllEvent(): Promise<EventEntity[]>;
  abstract findOneEvent(id: number): Promise<EventEntity>;
  abstract updateEvent(id: number, eventEntity: EventEntity): Promise<EventEntity>;
  abstract removeEvent(id: number): Promise<EventEntity>;
}