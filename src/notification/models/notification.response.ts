import { timeSince } from '../../helpers/functions';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationType } from '../notification.types';

export class NotificationResponse {
  slug: string;
  name: string;
  username: string;
  location: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;

  constructor(notification: NotificationEntity) {
    this.slug = notification.slug;
    this.name = notification.linkedUser?.name;
    this.username = notification.linkedUser?.username;
    this.location = notification.linkedUser?.location;
    this.type = notification.type;
    this.read = !!notification.read;
    this.timestamp = timeSince(notification.created);
  }
}
