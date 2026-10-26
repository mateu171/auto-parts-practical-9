import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    Length,
    IsEnum,
} from 'class-validator';
import { Condition } from './condition';

export class CreatePartDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    oemCode: string;

    @IsEnum(Condition)
    condition: Condition;

    @IsString()
    @IsNotEmpty()
    carBrand: string;
}