import { IsDateString, IsNotEmpty, MaxLength, MinLength, Validate } from "class-validator";
import { IsFutureDate } from "../validators/is-future-date.validator";

export class CreateEventDto {

  @IsNotEmpty()
  @MinLength(3, { message: 'Name is too short' })
  @MaxLength(50 , { message: 'Name is too long' })
  name: string;

  @IsNotEmpty()
  @IsDateString({strict: true}, { message: 'Invalid date format. Expected YYYY-MM-DD format' })
  @Validate(IsFutureDate, { message: 'Date must be in the future' })
  date: string;
}
