import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableAbstractRepository } from './repositories/tables-abstract.repository';

@Injectable()
export class TablesService {
  constructor(private readonly tablesRepository: TableAbstractRepository) {}

  async findAll() {
    const result = {
      tables: await this.tablesRepository.findAllTables(),
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

    const result = {
      table: await this.tablesRepository.updateTable(id, targetTable),
    };
    return result;
  }
}
