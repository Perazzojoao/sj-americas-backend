import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { UpdateTableDto } from './dto/update-table.dto';
import { DefaultResponse } from 'src/lib/default-response';

@Controller('table')
export class TablesController extends DefaultResponse {
  constructor(private readonly tablesService: TablesService) {
    super();
  }

  @Get()
  async findAll(@Query('eventId') eventId: number) {
    const response = await this.tablesService.findAll(eventId);
    return this.success(response, 'Tables fetched successfully');
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const response = await this.tablesService.findOne(+id);
    return this.success(response, 'Table fetched successfully');
  }

  @Patch('multiples')
  async updateMultiple(@Body() updateTableDto: UpdateTableDto) {
    const response = await this.tablesService.updateMultiple(updateTableDto);
    return this.success(response, 'Tables updated successfully');
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateTableDto: UpdateTableDto) {
    const response = await this.tablesService.update(+id, updateTableDto);
    return this.success(response, 'Table updated successfully');
  }
}
