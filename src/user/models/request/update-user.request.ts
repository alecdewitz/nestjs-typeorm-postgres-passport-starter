import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserRequest {
  @IsOptional()
  @IsNotEmpty()
  @Matches(RegExp("^[A-Za-zıöüçğşİÖÜÇĞŞñÑáéíóúÁÉÍÓÚ ']+$"))
  @MaxLength(40)
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @Matches(RegExp('^[a-zA-Z0-9\\-_]+$'))
  @Transform(({ value }) => value.toLowerCase())
  @MinLength(4)
  @MaxLength(20)
  username?: string;

  @IsOptional()
  @Matches(RegExp('^[a-zA-Z0-9\\-_ ]+$'))
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @MaxLength(40)
  company?: string;

  @IsOptional()
  @MaxLength(60)
  location?: string;

  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  birthday?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsString()
  @MaxLength(170)
  bio?: string;
}
