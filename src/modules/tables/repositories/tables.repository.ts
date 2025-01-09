import { InternalServerErrorException } from '@nestjs/common';
import { TableEntity } from '../entities/table.entity';
import { TablesAbstractRepository } from './tables-abstract.repository';
import { DatabaseService } from 'src/database/database.service';

export class TablesRepository implements TablesAbstractRepository {
  constructor (private readonly prisma: DatabaseService) {}

  async createTable(tableEntity: TableEntity): Promise<TableEntity> {
    try {
      return await this.prisma.tables.create({
        data: tableEntity,
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to create table');
    }
  }

  async findAllTables(): Promise<TableEntity[]> {
    throw new Error('Method not implemented.');
  }

  async findTableById(id: number): Promise<TableEntity> {
    throw new Error('Method not implemented.');
  }

  async updateTable(
    id: number,
    tableEntity: TableEntity,
  ): Promise<TableEntity> {
    throw new Error('Method not implemented.');
  }

  async deleteTable(id: number): Promise<TableEntity> {
    throw new Error('Method not implemented.');
  }
}
