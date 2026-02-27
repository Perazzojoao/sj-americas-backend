import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { JwtTokenModule } from './jwt/jwt-token.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventModule } from './modules/event/event.module';
import { TablesModule } from './modules/tables/tables.module';
import { UsersModule } from './modules/users/users.module';
import { HttpExceptionFilter } from './resources/filters/http-exception/http-exception.filter';
import { AuthGuard } from './resources/guards/auth.guard';
import { ThrottlerBehindProxyGuard } from './resources/guards/throttler-behind-proxy/throttler-behind-proxy.guard';
import { LoggerInterceptor } from './resources/interceptors/logger/logger.interceptor';

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
    ThrottlerModule.forRoot([
      {
        ttl: 30000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    ConsoleLogger,
  ],
})
export class AppModule {}
