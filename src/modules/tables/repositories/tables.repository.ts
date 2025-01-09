import { InternalServerErrorException } from '@nestjs/common';
import { TableEntity } from '../entities/table.entity';
import { TablesAbstractRepository } from './tables-abstract.repository';
import { DatabaseService } from 'src/database/database.service';

export class TablesRepository implements TablesAbstractRepository {
  constructor(private readonly prisma: DatabaseService) {}

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
    try {
      return await this.prisma.tables.findMany();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to fetch table list');
    }
  }

  async findTableById(id: number): Promise<TableEntity> {
    try {
      return await this.prisma.tables.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to fetch table');
    }
  }

  async updateTable(
    id: number,
    tableEntity: TableEntity,
  ): Promise<TableEntity> {
    try {
      return await this.prisma.tables.update({
        where: {
          id,
        },
        data: {
          ...tableEntity,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to update table');
    }
  }

  async deleteTable(id: number): Promise<TableEntity> {
    try {
      return await this.prisma.tables.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to delete table');
    }
  }
}
