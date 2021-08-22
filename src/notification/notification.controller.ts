import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './../user/entities/user.entity';
import { Usr } from './../user/user.decorator';
import { NotificationService } from './notification.service';

@ApiTags('notification')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(@Usr() user: UserEntity) {
    return await this.notificationService.getNotifications(user);
  }

  @Post()
  markAsRead(@Body('slug') slug: string) {
    return this.notificationService.markAsRead(slug);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
