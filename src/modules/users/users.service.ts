import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersAbstractRepository } from './repositories/users-abstract.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersAbstractRepository) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new UserEntity(createUserDto);
    const isUserAlreadyExists = this.usersRepository.findUserByName(
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
