import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersAbstractRepository } from './repositories/users-abstract.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersAbstractRepository) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new UserEntity(createUserDto);
    const isUserAlreadyExists = await this.usersRepository.findUserByName(
      newUser.user_name,
    );
    if (isUserAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    const { password, ...userCreated } =
      await this.usersRepository.createUser(newUser);
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    const targetUser = await this.usersRepository.findUserById(id);
    if (!targetUser) {
      throw new NotFoundException('User not found');
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

  async remove(id: number) {
    const targetUser = await this.usersRepository.findUserById(id);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const { password, ...user } = await this.usersRepository.deleteUser(id);
    return {
      user,
    };
  }
}
