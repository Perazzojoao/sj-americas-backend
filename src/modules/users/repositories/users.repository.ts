import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UsersAbstractRepository } from './users-abstract.repository';
import { DatabaseService } from 'src/database/database.service';
import { JwtPayload } from 'src/jwt/jwt-token.service';

@Injectable()
export class UsersRepository implements UsersAbstractRepository {
  constructor(private readonly prisma: DatabaseService) {}

  async createUser(
    userEntity: UserEntity,
    currentUser: JwtPayload,
  ): Promise<UserEntity> {
    const { id, created_by, ...userData } = userEntity;
    try {
      return await this.prisma.user.create({
        data: {
          ...userData,
          createdBy: {
            connectOrCreate: {
              where: {
                id: userEntity.created_by || 0,
                user_id: currentUser.sub,
                user_name: currentUser.user_name,
              },
              create: {
                user_id: currentUser.sub,
                user_name: currentUser.user_name,
              },
            },
          },
        },
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
          created_by: true,
        },
        include: {
          createdBy: true,
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to fetch user list');
    }
  }

  async findUserById(id: number): Promise<Partial<UserEntity>> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id,
        },
        omit: {
          created_by: true,
        },
        include: {
          createdBy: true,
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

  async updateUser(
    userId: number,
    userEntity: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const { id, created_by, ...userData } = userEntity;
    try {
      return await this.prisma.user.update({
        where: {
          id: userId,
          NOT: {
            role: 'SUPER_ADMIN',
          },
        },
        data: {
          ...userData,
          createdBy: {},
        },
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
