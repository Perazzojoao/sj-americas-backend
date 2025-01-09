import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TableEntity } from '../entities/table.entity';
import { TableAbstractRepository } from './tables-abstract.repository';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TableRepository implements TableAbstractRepository {
  constructor(private readonly prisma: DatabaseService) {}

  async createTable(tableEntity: TableEntity): Promise<TableEntity> {
    try {
      return await this.prisma.table.create({
        data: tableEntity,
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to create table');
    }
  }

  async findAllTables(eventId?: number): Promise<TableEntity[]> {
    try {
      return await this.prisma.table.findMany({
        where: eventId ? { eventId } : {},
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to fetch table list');
    }
  }

  async findTableById(id: number): Promise<TableEntity> {
    try {
      return await this.prisma.table.findUnique({
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
      return await this.prisma.table.update({
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
      return await this.prisma.table.delete({
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
