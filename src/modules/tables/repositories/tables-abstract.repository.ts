import { Prisma } from '@prisma/client';
import { TableEntity } from '../entities/table.entity';

export abstract class TableAbstractRepository {
  abstract createTable(tableEntity: TableEntity): Promise<TableEntity>;
  abstract findAllTables(eventId?: number): Promise<TableEntity[]>;
  abstract findAllTablesByIds(idList: number[]): Promise<TableEntity[]>
  abstract findTableById(id: number): Promise<TableEntity>;
  abstract updateTable(
    id: number,
    tableEntity: TableEntity,
  ): Promise<TableEntity>;
  abstract updateMultipleTables(
    idList: number[],
    data: {
      owner?: number;
      isTaken?: boolean;
      isPaid?: boolean;
      seats?: number;
    },
  ): Promise<void>;
  abstract deleteTable(id: number): Promise<TableEntity>;
}
