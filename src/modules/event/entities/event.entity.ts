import { Event } from '@prisma/client';

export class EventEntity implements Event {
  id: number;
  name: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial);
  }
}
