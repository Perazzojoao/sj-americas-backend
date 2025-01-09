import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { TablesAbstractRepository } from './repositories/tables-abstract.repository';
import { TablesRepository } from './repositories/tables.repository';

@Module({
  controllers: [TablesController],
  providers: [
    TablesService,
    {
      provide: TablesAbstractRepository,
      useClass: TablesRepository,
    },
  ],
})
export class TablesModule {}
