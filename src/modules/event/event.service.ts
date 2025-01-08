import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventAbstractRepository } from './repositories/event-abstract.repository';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventAbstractRepository) {}

  async create(createEventDto: CreateEventDto) {
    const newEvent = new EventEntity(createEventDto);
    const response = {
      event: await this.eventRepository.createEvent(newEvent),
    };

    if (!response.event) {
      throw new InternalServerErrorException('Event not created');
    }
    return response;
  }

  async findAll() {
    const response = {
      event_list: await this.eventRepository.findAllEvents(),
    };
    return response;
  }

  async findOne(id: number) {
    const response = {
      event: await this.eventRepository.findEventById(id),
    };

    if (!response.event) {
      throw new NotFoundException('Event not found');
    }
    return response;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const targetEvent = await this.eventRepository.findEventById(id);

    if (!targetEvent) {
      throw new NotFoundException('Event not found');
    }

    Object.assign(targetEvent, updateEventDto);

    const response = {
      event: await this.eventRepository.updateEvent(id, targetEvent),
    };
    return response;
  }

  async remove(id: number) {
    const targetEvent = await this.eventRepository.findEventById(id);

    if (!targetEvent) {
      throw new NotFoundException('Event not found');
    }

    const response = {
      event: await this.eventRepository.removeEvent(id),
    };
    return response;
  }
}
