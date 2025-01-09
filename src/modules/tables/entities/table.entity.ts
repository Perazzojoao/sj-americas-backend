import { Table } from '@prisma/client';

export class TableEntity implements Table {
  id: number;
  number: number;
  seats: number;
  owner: number | null;
  eventId: number;
  isTaken: boolean;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TableEntity>) {
    Object.assign(this, partial);
  }
}
