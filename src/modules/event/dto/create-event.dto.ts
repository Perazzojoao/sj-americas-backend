import { IsDateString, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateEventDto {

  @IsNotEmpty()
  @MinLength(3, { message: 'Name is too short' })
  @MaxLength(50 , { message: 'Name is too long' })
  name: string;

  @IsNotEmpty()
  @IsDateString({strict: true}, { message: 'Invalid date format. Expected ISO-8601 DateTime' })
  date: Date;
}
