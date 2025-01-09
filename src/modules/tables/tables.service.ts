import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableAbstractRepository } from './repositories/tables-abstract.repository';

@Injectable()
export class TablesService {
  constructor(private readonly tablesRepository: TableAbstractRepository) {}

  async findAll(eventId?: number) {
    const result = {
      tables: await this.tablesRepository.findAllTables(eventId),
    };
    return result;
  }

  async findOne(id: number) {
    const result = {
      table: await this.tablesRepository.findTableById(id),
    };
    if (!result.table) {
      throw new NotFoundException('Table not found');
    }
    return result;
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    const targetTable = await this.tablesRepository.findTableById(id);
    if (!targetTable) {
      throw new Error('Table not found');
    }

    Object.assign(targetTable, updateTableDto);

    if (updateTableDto.owner) {
      targetTable.isTaken = true;
    } else if (!targetTable.owner) {
      targetTable.isTaken = false;
    }

    const result = {
      table: await this.tablesRepository.updateTable(id, targetTable),
    };
    return result;
  }
}
