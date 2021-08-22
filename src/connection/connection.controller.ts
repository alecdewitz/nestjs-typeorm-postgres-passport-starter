import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './../user/entities/user.entity';
import { Usr } from './../user/user.decorator';
import { ConnectionService } from './connection.service';
import { ConnectionRequest } from './models/connection.request';

@ApiTags('connection')
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  @Post()
  create(
    @Usr() user: UserEntity,
    @Body() connectionRequest: ConnectionRequest,
  ) {
    const { contactSlug } = connectionRequest;
    return this.connectionService.create(user.id, contactSlug);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  @Get()
  async findAll(@Usr() user: UserEntity) {
    return this.connectionService.findAll(user.id);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  @Get(':slug')
  findOne(@Usr() user: UserEntity, @Param('slug') slug: string) {
    return this.connectionService.findOne(user, slug);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateConnectionDto: UpdateConnection,
  // ) {
  //   return this.connectionService.update(+id, updateConnectionDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.connectionService.remove(+id);
  }
}
