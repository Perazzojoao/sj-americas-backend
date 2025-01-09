import { Event } from '@prisma/client';
import { TableEntity } from 'src/modules/tables/entities/table.entity';

export class EventEntity implements Event {
  id: number;
  name: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
  tables?: TableEntity[];

  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial);
  }
}
