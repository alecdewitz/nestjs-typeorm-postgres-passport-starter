import { ConnectionRequest } from './connection.request';
import { PartialType } from '@nestjs/swagger';

export class UpdateConnection extends PartialType(ConnectionRequest) {}
