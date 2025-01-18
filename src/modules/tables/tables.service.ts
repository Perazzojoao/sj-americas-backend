import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TableAbstractRepository } from './repositories/tables-abstract.repository';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateEventDto } from '../event/dto/update-event.dto';
import { TableEntity } from './entities/table.entity';

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
      throw new NotFoundException('Table not found');
    }

    if (updateTableDto.owner === null && updateTableDto.is_paid) {
      throw new BadRequestException('Cannot change owner of a paid table');
    }

    if (updateTableDto.owner !== targetTable.owner && targetTable.isPaid) {
      throw new BadRequestException('Cannot change owner of a paid table');
    }

    Object.assign(
      targetTable,
      (() => {
        const { is_paid, ...dataDto } = updateTableDto;
        return dataDto;
      })(),
    );

    if (updateTableDto.owner) {
      targetTable.isTaken = true;
    } else if (!targetTable.owner) {
      targetTable.isTaken = false;
    }

    if (updateTableDto.is_paid && !targetTable.isPaid && targetTable.isTaken) {
      targetTable.isPaid = updateTableDto.is_paid;
    } else if (!updateTableDto.is_paid && targetTable.isPaid) {
      targetTable.isPaid = updateTableDto.is_paid;
    }

    const result = {
      table: await this.tablesRepository.updateTable(id, targetTable),
    };
    return result;
  }

  async updateMultiple(updateTableDto: UpdateTableDto) {
    const { table_list_ids, is_paid, ...data } = updateTableDto;
    const targetTables =
      await this.tablesRepository.findAllTablesByIds(table_list_ids);
    if (targetTables.length === 0) {
      throw new NotFoundException('Tables not found');
    }

    if (data.owner === null && is_paid) {
      throw new BadRequestException('Cannot change owner of a paid table');
    }

    const tableData = new TableEntity(data);
    tableData.isTaken = !!data.owner;

    const isAnyTablePaid = targetTables.some((table) => table.isPaid);
    const isAllTablesTaken = targetTables.every((table) => table.isTaken);
    const isSameOwner = (owner: number) => targetTables.every((table) => table.owner === owner);

    if (isAnyTablePaid && !isSameOwner(data.owner)) {
      throw new BadRequestException('Cannot change owner of a paid table');
    }

    if (is_paid && !isAnyTablePaid && isAllTablesTaken) {
      tableData.isPaid = is_paid;
    } else if (!is_paid && isAllTablesTaken) {
      tableData.isPaid = is_paid;
    }

    await this.tablesRepository.updateMultipleTables(table_list_ids, tableData);

    const result = {
      table_ids: table_list_ids,
    };
    return result;
  }
}
