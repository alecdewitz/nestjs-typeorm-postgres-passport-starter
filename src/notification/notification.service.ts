import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './../user/entities/user.entity';
import { NotificationResponse } from './models/notification.response';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationType } from './notification.types';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  viewProfile(user: UserEntity, viewedUser: UserEntity) {
    const notification = new NotificationEntity();
    notification.type = NotificationType.VIEW_PROFILE;
    notification.user = viewedUser;
    notification.linkedUser = user;

    this.notificationRepository.save(notification);
  }

  async getNotifications(user: UserEntity): Promise<NotificationResponse[]> {
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .innerJoin('notification.user', 'user', 'user.id = :userId', {
        userId: user.id,
      })
      .leftJoinAndSelect('notification.linkedUser', 'linkedUser')
      .orderBy('notification.created', 'DESC')
      .getMany();

    return notifications.map(
      (notification) => new NotificationResponse(notification),
    );
  }

  markAsRead(slug: string) {}

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
