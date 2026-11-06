import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreatePartDto } from './create-part.dto';

export class CreatePartWithRelationsDto extends CreatePartDto {
  @IsUUID()
  carModelId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  specificationIds: string[];

  @IsString()
  @IsNotEmpty()
  compatibilityCode: string;

  @IsOptional()
  @IsBoolean()
  simulateError?: boolean;
}