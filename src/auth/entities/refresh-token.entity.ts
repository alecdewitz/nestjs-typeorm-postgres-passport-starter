import { UserEntity } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('refresh-token')
export class RefreshToken {
  @PrimaryColumn('character', { length: 21 })
  token: string;

  @Column('timestamp without time zone')
  expiry: Date;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens)
  user: UserEntity;

  @Column('integer')
  userId: number;

  @Column('text')
  deviceId: string;
}
