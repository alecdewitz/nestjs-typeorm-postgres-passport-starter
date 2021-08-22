import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';
import { BaseEntity } from 'src/base.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationPayload, NotificationType } from './../notification.types';

@Entity('notification')
@Index('index_notification_slug', ['slug'], { unique: true })
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  slug: string;

  @Column('text')
  type: NotificationType;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column('integer')
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  linkedUser: UserEntity;

  @Column('integer', { nullable: true })
  linkedUserId?: number;

  @Column('boolean', { default: false, nullable: true })
  read?: Date;

  @Column('json', { nullable: true })
  meta?: NotificationPayload;

  @BeforeInsert()
  updateSlug(): void {
    this.slug = customAlphabet(nolookalikes, 28)();
  }
}
