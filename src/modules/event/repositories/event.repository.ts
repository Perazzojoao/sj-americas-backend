import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  async findEventById(id: number): Promise<EventEntity> {
    try {
      return await this.prisma.event.findUnique({
        where: {
          id,
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
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to update event');
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
