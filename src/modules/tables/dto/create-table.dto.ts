import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTableDto {
  @IsOptional()
  @IsInt({ message: 'Owner must be a integer' })
  @Min(1, { message: 'Owner must be greater than 0' })
  owner?: number;

  @IsOptional()
  @IsBoolean({ message: 'is_paid must be a boolean' })
  is_paid?: boolean;

  @IsOptional()
  @IsInt({ message: 'Seats must be a integer' })
  @Min(1, { message: 'Seats must be greater than 0' })
  @Max(10, { message: 'Seats must be less than 11' })
  seats?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return value;
    return value
      .map((name) => (typeof name === 'string' ? name.trim() : name))
      .filter((name) => typeof name === 'string' && name.length > 0);
  })
  @IsArray({ message: 'guest_names must be an array' })
  @ArrayMaxSize(10, { message: 'guest_names must contain up to 10 names' })
  @IsString({ each: true, message: 'Each guest name must be a string' })
  @MinLength(1, {
    each: true,
    message: 'Each guest name must contain at least 1 character',
  })
  @MaxLength(80, {
    each: true,
    message: 'Each guest name must contain up to 80 characters',
  })
  guest_names?: string[];
}
