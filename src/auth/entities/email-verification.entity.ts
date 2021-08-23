import {
  Column, Entity, Index, PrimaryColumn,
} from 'typeorm';

@Entity('email-verification')
@Index('index_email-verification_userId', ['userId'], { unique: true })
export class EmailVerification {
  @PrimaryColumn('character', { length: 21 })
  token: string;

  @Column('integer')
  userId: number;

  @Column('timestamp', { default: () => 'timezone(\'utc\', now()) + interval \'2 days\'' })
  validUntil: string; // ISO Date
}
