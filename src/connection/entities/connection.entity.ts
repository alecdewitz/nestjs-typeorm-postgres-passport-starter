import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';
import { BaseEntity } from 'src/base.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { ConnectionStatus } from './../models/connection-status.enum';

@Entity('connection')
@Index('index_connection_slug', ['slug'], { unique: true })
export class ConnectionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  slug: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  contact: UserEntity;

  @Column()
  contactId: number;

  @Column('text')
  status: ConnectionStatus;

  @BeforeInsert()
  updateSlug(): void {
    this.slug = customAlphabet(nolookalikes, 28)();
  }
}
