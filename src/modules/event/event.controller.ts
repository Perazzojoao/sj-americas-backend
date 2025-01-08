import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DefaultResponse } from 'src/lib/default-response';

@Controller('event')
export class EventController extends DefaultResponse {
  constructor(private readonly eventService: EventService) {
    super();
  }

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const response = await this.eventService.create(createEventDto);
    return this.success(response, 'Event created successfully', HttpStatus.CREATED)
  }

  @Get()
  async findAll() {
    const response = await this.eventService.findAll();
    return this.success(response, 'Evet list fetched successfully')
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const response = await this.eventService.findOne(+id);
    return this.success(response, 'Event fetched successfully')
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateEventDto: UpdateEventDto) {
    const response = await this.eventService.update(+id, updateEventDto);
    return this.success(response, 'Event updated successfully')
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    const response = await this.eventService.remove(+id);
    return this.success(response, 'Event deleted successfully')
  }
}
