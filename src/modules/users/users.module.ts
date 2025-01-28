import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersAbstractRepository } from './repositories/users-abstract.repository';
import { UsersRepository } from './repositories/users.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UsersAbstractRepository,
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService, UsersAbstractRepository],
})
export class UsersModule {}
