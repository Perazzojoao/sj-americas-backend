import { IsBoolean, IsIn, IsInt, IsOptional, Max, Min } from "class-validator";

export class CreateTableDto {

  @IsOptional()
  @IsInt({ message: 'Owner must be a integer' })
  @Min(1, { message: 'Owner must be greater than 0' })
  owner?: number;

  @IsOptional()
  @IsBoolean({ message: 'is_taken must be a boolean' })
  is_taken?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'is_paid must be a boolean' })
  is_paid?: boolean;

  @IsOptional()
  @IsInt({ message: 'Seats must be a integer' })
  @Min(1, { message: 'Seats must be greater than 0' })
  @Max(10, { message: 'Seats must be less than 11' })
  seats?: number;
}
