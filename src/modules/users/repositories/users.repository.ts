import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UsersAbstractRepository } from './users-abstract.repository';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersRepository implements UsersAbstractRepository {
  constructor(private readonly prisma: DatabaseService) {}

  async createUser(userEntity: UserEntity): Promise<UserEntity> {
    try {
      return await this.prisma.user.create({
        data: userEntity,
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAllUsers(): Promise<Partial<UserEntity>[]> {
    try {
      return await this.prisma.user.findMany({
        omit: {
          password: true,
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to fetch user list');
    }
  }

  async findUserById(id: number): Promise<UserEntity> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async findUserByName(user_name: string): Promise<UserEntity> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          user_name,
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async updateUser(id: number, userEntity: UserEntity): Promise<UserEntity> {
    try {
      return await this.prisma.user.update({
        where: {
          id,
          NOT: {
            role: 'SUPER_ADMIN',
          },
        },
        data: userEntity,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      console.log(error.message);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<UserEntity> {
    try {
      return await this.prisma.user.delete({
        where: {
          id,
          NOT: {
            role: 'SUPER_ADMIN',
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      console.log(error.message);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
