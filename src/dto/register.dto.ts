import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Некоректний формат email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Пароль повинен містити мінімум 6 символів' })
  @MaxLength(64, { message: 'Пароль повинен містити максимум 64 символи' })
  password: string;
}