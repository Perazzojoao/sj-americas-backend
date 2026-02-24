import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { EventEntity } from '../entities/event.entity';
import { EventAbstractRepository } from './event-abstract.repository';

@Injectable()
export class EventRepository implements EventAbstractRepository {
  constructor(private readonly prisma: DatabaseService) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  private getErrorCode(error: unknown): string | undefined {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const maybeCode = (error as { code?: unknown }).code;
      return typeof maybeCode === 'string' ? maybeCode : undefined;
    }

    return undefined;
  }

  async createEvent(eventEntity: EventEntity): Promise<EventEntity> {
    try {
      const initialFourSeatCount = 10;
      const maxMiddleEightSeatCount = 58;
      const extraFourSeatCount =
        eventEntity.tableCount === 88
          ? 20
          : eventEntity.tableCount === 78
            ? 10
            : Math.max(eventEntity.tableCount - 68, 0);
      const middleEightSeatCount = Math.min(
        maxMiddleEightSeatCount,
        Math.max(
          eventEntity.tableCount - initialFourSeatCount - extraFourSeatCount,
          0,
        ),
      );

      return await this.prisma.event.create({
        data: {
          ...eventEntity,
          tables: {
            createMany: {
              data: Array.from({ length: eventEntity.tableCount }).map(
                (_, index) => ({
                  number: index + 1,
                  seats:
                    index < initialFourSeatCount
                      ? 4
                      : index < initialFourSeatCount + middleEightSeatCount
                        ? 8
                        : 4,
                }),
              ),
            },
          },
        },
      });
    } catch (error) {
      console.log(this.getErrorMessage(error));
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async findAllEvents(): Promise<EventEntity[]> {
    try {
      return await this.prisma.event.findMany();
    } catch (error) {
      console.log(this.getErrorMessage(error));
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
      console.log(this.getErrorMessage(error));
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
      console.log(this.getErrorMessage(error));
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
      console.log(this.getErrorMessage(error));
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
      console.log(this.getErrorMessage(error));
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
      if (this.getErrorCode(error) === 'P2025') {
        throw new NotFoundException('Event not found');
      }
      console.log(this.getErrorMessage(error));
      throw new InternalServerErrorException('Failed to delete event');
    }
  }
}
