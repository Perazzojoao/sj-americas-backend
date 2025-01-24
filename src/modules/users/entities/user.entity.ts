import { User } from '@prisma/client';

export class UserEntity implements User {
  id: number;
  user_name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
