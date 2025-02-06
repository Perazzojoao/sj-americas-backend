import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersAbstractRepository } from './repositories/users-abstract.repository';
import { UserEntity } from './entities/user.entity';
import { JwtPayload } from 'src/jwt/jwt-token.service';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersAbstractRepository) {}

  async create(createUserDto: CreateUserDto, currentUser: JwtPayload) {
    const newUser = new UserEntity(createUserDto);
    const isUserAlreadyExists = await this.usersRepository.findUserByName(
      newUser.user_name,
    );
    if (isUserAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    const { password, ...userCreated } =
      await this.usersRepository.createUser(newUser, currentUser);
    const response = {
      user: userCreated,
    };
    return response;
  }

  async findAll() {
    return {
      user_list: await this.usersRepository.findAllUsers(),
    };
  }

  async findOne(id: number) {
    return {
      user: await this.usersRepository.findUserById(id),
    };
  }

  async findOneByUserName(user_name: string) {
    return {
      user: await this.usersRepository.findUserByName(user_name),
    };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: JwtPayload,
  ) {
    const targetUser = await this.usersRepository.findUserById(id);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const isPermitted = this.adminCheck(currentUser, targetUser);
    if (!isPermitted) {
      throw new ForbiddenException('You are not allowed to update this user');
    }

    Object.assign(targetUser, updateUserDto);

    const { password, ...userUpdated } = await this.usersRepository.updateUser(
      id,
      targetUser,
    );

    return {
      user: userUpdated,
    };
  }

  async remove(id: number, currentUser: JwtPayload) {
    const targetUser = await this.usersRepository.findUserById(id);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const isPermitted = this.adminCheck(currentUser, targetUser);
    if (!isPermitted) {
      throw new ForbiddenException('You are not allowed to delete this user');
    }

    const { password, ...user } = await this.usersRepository.deleteUser(id);
    return {
      user,
    };
  }

  private adminCheck(currentUser: JwtPayload, targetUser: UserEntity) {
    if (
      targetUser.role === 'ADMIN' &&
      currentUser.role !== 'SUPER_ADMIN' &&
      targetUser.id !== currentUser.sub
    ) {
      return false;
    }
    return true;
  }
}
