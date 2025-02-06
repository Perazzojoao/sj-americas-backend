import { $Enums, CreatedBy, User } from '@prisma/client';

export class UserEntity implements User {
  id: number;
  user_name: string;
  password: string;
  role: $Enums.Role;
  created_by: number | null;
  createdBy?: CreatedByEntity;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

export class CreatedByEntity implements CreatedBy{
  id: number;
  user_name: string;
  user_id: number;
  created_users?: UserEntity[];
}