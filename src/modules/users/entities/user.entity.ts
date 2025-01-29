import { $Enums, User } from '@prisma/client';

export class UserEntity implements User {
  id: number;
  user_name: string;
  password: string;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
