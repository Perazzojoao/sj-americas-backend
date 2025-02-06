import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventAbstractRepository } from './event-abstract.repository';
import { EventEntity } from '../entities/event.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EventRepository implements EventAbstractRepository {
  constructor(private readonly prisma: DatabaseService) {}

  async createEvent(eventEntity: EventEntity): Promise<EventEntity> {
    try {
      return await this.prisma.event.create({
        data: {
          ...eventEntity,
          tables: {
            createMany: {
              data: Array.from({ length: eventEntity.tableCount }).map(
                (_, index) => ({
                  number: index + 1,
                  seats: index < 10 ? 4 : 8,
                }),
              ),
            },
          },
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async findAllEvents(): Promise<EventEntity[]> {
    try {
      return await this.prisma.event.findMany();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to fetch event list');
    }
  }

  async findEventById(
    id: number,
    includeTables: boolean = false,
  ): Promise<EventEntity> {
    try {
      return await this.prisma.event.findUnique({
        where: {
          id,
        },
        include: {
          tables: includeTables,
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to fetch event');
    }
  }

  async updateEvent(
    id: number,
    eventEntity: EventEntity,
  ): Promise<EventEntity> {
    try {
      return await this.prisma.event.update({
        where: {
          id,
        },
        data: {
          ...eventEntity,
          updatedAt: new Date(),
          tables: {},
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to update event');
    }
  }

  async addTables(
    eventId: number,
    quantity: number,
    startNumber: number,
  ): Promise<void> {
    try {
      await this.prisma.table.createMany({
        data: Array.from({ length: quantity }).map((_, index) => ({
          eventId,
          number: startNumber + index + 1,
        })),
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to add tables');
    }
  }

  async removeTables(eventId: number, quantity: number): Promise<void> {
    try {
      const tables = await this.prisma.table.findMany({
        where: { eventId },
        orderBy: { number: 'desc' },
        take: quantity,
      });

      const tableIds = tables.map((table) => table.id);

      await this.prisma.table.deleteMany({
        where: {
          id: { in: tableIds },
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to remove tables');
    }
  }

  async removeEvent(id: number): Promise<EventEntity> {
    try {
      return await this.prisma.event.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Event not found');
      }
      console.log(error.message);
      throw new InternalServerErrorException('Failed to delete event');
    }
  }
}
