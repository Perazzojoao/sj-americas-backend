import { Event } from "@prisma/client";

export class EventEntity implements Event {
  id: number;
  name: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
