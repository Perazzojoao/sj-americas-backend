import { PartialType } from '@nestjs/mapped-types';
import { CreateTableDto } from './create-table.dto';
import { IsOptional } from 'class-validator';
import { IsCustomIntEach } from '../decorators/custom-int-each.decorator';

export class UpdateTableDto extends PartialType(CreateTableDto) {
  @IsOptional()
  @IsCustomIntEach({ message: 'Table list ids must be an array of positive integers' })
  table_list_ids?: number[];
}
