import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty({message: 'User name is required'})
  @MinLength(3, {'message': 'User name must be at least 3 characters long'})
  @MaxLength(20, {'message': 'User name must be at most 20 characters long'})
  user_name: string;

  @IsNotEmpty({message: 'Password is required'})
  @MinLength(6, {'message': 'Password must be at least 6 characters long'})
  @MaxLength(20, {'message': 'Password must be at most 20 characters long'})
  password: string;
}
