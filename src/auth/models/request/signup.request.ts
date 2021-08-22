import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupRequest {
  @IsNotEmpty()
  @Matches(RegExp('^[A-Za-zıöüçğşİÖÜÇĞŞñÑáéíóúÁÉÍÓÚ ]+$'))
  @MaxLength(100)
  name: string;

  // alphanumeric characters and _ are valid
  @Matches(RegExp('^[a-zA-Z0-9\\_]+$'))
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Transform(({ value }) => value.toLowerCase())
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
