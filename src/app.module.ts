import { ConsoleLogger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './resources/filters/http-exception/http-exception.filter';
import { LoggerInterceptor } from './resources/interceptors/logger/logger.interceptor';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './modules/event/event.module';
import { TablesModule } from './modules/tables/tables.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtTokenModule } from './jwt/jwt-token.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './resources/guards/auth.guard';

@Module({
  imports: [
    DatabaseModule,
    EventModule,
    TablesModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtTokenModule,
    AuthModule,
  ],
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
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ConsoleLogger,
  ],
})
export class AppModule {}
