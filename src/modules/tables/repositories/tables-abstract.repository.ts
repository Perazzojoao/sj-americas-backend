import { TableEntity } from "../entities/table.entity";

export abstract class TableAbstractRepository {
  abstract createTable(tableEntity: TableEntity): Promise<TableEntity>;
  abstract findAllTables(): Promise<TableEntity[]>;
  abstract findTableById(id: number): Promise<TableEntity>;
  abstract updateTable(id: number, tableEntity: TableEntity): Promise<TableEntity>;
  abstract deleteTable(id: number): Promise<TableEntity>;
}