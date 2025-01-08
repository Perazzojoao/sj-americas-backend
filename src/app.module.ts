import { ConsoleLogger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './resources/filters/http-exception/http-exception.filter';
import { LoggerInterceptor } from './resources/interceptors/logger/logger.interceptor';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './modules/event/event.module';
import { TablesModule } from './modules/tables/tables.module';

@Module({
  imports: [DatabaseModule, EventModule, TablesModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    ConsoleLogger,
  ],
})
export class AppModule {}
