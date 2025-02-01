import { IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { $Enums } from '@prisma/client';
import { IsNotSuperAdmin } from '../decorators/is-not-super-admin.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'User name is required' })
  @MinLength(3, { message: 'User name must be at least 3 characters long' })
  @MaxLength(20, { message: 'User name must be at most 20 characters long' })
  user_name: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  password: string;

  @IsOptional()
  @IsEnum($Enums.Role, { message: 'Role must be either ADMIN or USER' })
  @IsNotSuperAdmin()
  role: $Enums.Role;
}
