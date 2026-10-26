import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Length,
} from 'class-validator';
import { Condition } from './condition';

export class UpdatePartDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    oemCode?: string;

    @IsOptional()
    @IsEnum(Condition)
    condition?: Condition;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    carBrand?: string;
}