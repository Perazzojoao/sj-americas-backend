import { IsDateString, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateEventDto {

  @IsNotEmpty()
  @MinLength(3, { message: 'Name is too short' })
  @MaxLength(50 , { message: 'Name is too long' })
  name: string;

  @IsNotEmpty()
  @IsDateString({strict: true}, { message: 'Invalid date format. Correct format: YYYY-MM-DD' })
  date: Date;
}
