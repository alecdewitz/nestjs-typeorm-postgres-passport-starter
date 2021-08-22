import { Transform } from 'class-transformer';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
