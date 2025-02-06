import { JwtPayload } from 'src/jwt/jwt-token.service';
import { UserEntity } from '../entities/user.entity';

export abstract class UsersAbstractRepository {
  abstract createUser(userEntity: UserEntity, currentUser: JwtPayload): Promise<UserEntity>;
  abstract findAllUsers(): Promise<Partial<UserEntity>[]>;
  abstract findUserById(id: number): Promise<Partial<UserEntity>>;
  abstract findUserByName(user_name: string): Promise<UserEntity>;
  abstract updateUser(id: number, userEntity: Partial<UserEntity>): Promise<UserEntity>;
  abstract deleteUser(id: number): Promise<UserEntity>;
}
