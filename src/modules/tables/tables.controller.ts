import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { UpdateTableDto } from './dto/update-table.dto';
import { DefaultResponse } from 'src/lib/default-response';

@Controller('tables')
export class TablesController extends DefaultResponse {
  constructor(private readonly tablesService: TablesService) {
    super();
  }

  @Get()
  async findAll() {
    const response = await this.tablesService.findAll();
    return this.success(response, 'Tables fetched successfully');
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const response = await this.tablesService.findOne(+id);
    return this.success(response, 'Table fetched successfully');
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateTableDto: UpdateTableDto) {
    const response = await this.tablesService.update(+id, updateTableDto);
    return this.success(response, 'Table updated successfully');
  }
}
