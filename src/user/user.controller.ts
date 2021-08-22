import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { UpdateUserRequest } from './models';
import { ProfileResponse } from './models/profile.response';
import { Usr } from './user.decorator';
import { UserService } from './user.service';

@ApiTags('user')
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get('search')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async getSearchResults(
    @Query('query') query: string,
    @Usr() user: UserEntity,
  ): Promise<UserEntity[]> {
    return await this.userService.getSearchResults(user, query);
  }

  @ApiBearerAuth()
  @Get(':username')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard(['jwt', 'anonymous']))
  async getUserProfile(
    @Param('username') username: string,
    @Usr() user: UserEntity,
  ): Promise<ProfileResponse> {
    return await this.userService.getUserProfile(username, user);
  }

  // manually set a user as active
  @Get(':username/activate')
  @HttpCode(HttpStatus.OK)
  async activateUser(@Param('username') username: string): Promise<void> {
    await this.userService.setUserActive(username);
  }

  @ApiBearerAuth()
  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async updateUser(
    @Body() updateRequest: UpdateUserRequest,
    @Usr() user: UserEntity,
  ): Promise<void> {
    await this.userService.updateUser(user.id, updateRequest);
  }
}
