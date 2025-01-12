import { Event } from '@prisma/client';
import { TableEntity } from 'src/modules/tables/entities/table.entity';

export class EventEntity implements Event {
  id: number;
  name: string;
  date: string;
  tableCount: number;
  createdAt: Date;
  updatedAt: Date;
  tables?: TableEntity[];

  constructor(name: string, date: string, tableCount: number) {
    this.name = name;
    this.date = date;
    this.tableCount = tableCount;
  }
}
