import { IsNotEmpty } from 'class-validator';
export class ConnectionRequest {
  @IsNotEmpty()
  contactSlug: string;
}
