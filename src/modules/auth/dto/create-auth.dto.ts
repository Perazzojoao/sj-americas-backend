import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'User name is required' })
  @MinLength(1, { message: 'User name must not be empty' })
  user_name: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(1, { message: 'Password must not be empty' })
  password: string;
}
