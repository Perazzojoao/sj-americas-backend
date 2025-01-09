import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { TableAbstractRepository } from './repositories/tables-abstract.repository';
import { TableRepository } from './repositories/tables.repository';

@Module({
  controllers: [TablesController],
  providers: [
    TablesService,
    {
      provide: TableAbstractRepository,
      useClass: TableRepository,
    },
  ],
})
export class TablesModule {}
