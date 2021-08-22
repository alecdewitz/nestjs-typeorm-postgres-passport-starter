import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { BaseEntity } from 'src/base.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConnectionEntity } from './../../connection/entities/connection.entity';

@Entity('user')
@Index('index_user_username', ['username'], { unique: true })
@Index('index_user_email', ['email'], { unique: true })
@Index('index_user_slug', ['slug'], { unique: true })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  slug: string;

  @Column('text', { nullable: true })
  image?: string;

  @Column('text')
  name: string;

  @Column('text')
  username: string;

  @Column('text')
  email: string;

  @Column('text', { nullable: true })
  phone?: string;

  @Column('text', { nullable: true })
  title?: string;

  @Column('text', { nullable: true })
  company?: string;

  @Column('text', { nullable: true })
  location?: string;

  @Column('text', { nullable: true })
  bio?: string;

  @Column('date', { nullable: true })
  birthday?: Date;

  @Column('boolean', { default: false })
  emailVerified: boolean;

  @Column('boolean', { default: false })
  active: boolean;

  @Exclude()
  @Column('text')
  passwordHash: string;

  @OneToMany(() => ConnectionEntity, (connection) => connection.user, {
    cascade: true,
  })
  connections: ConnectionEntity[];

  // added me to contacts
  @OneToMany(() => ConnectionEntity, (connection) => connection.contact)
  inverseConnections: ConnectionEntity[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  @BeforeInsert()
  updateSlug(): void {
    this.slug = customAlphabet(nolookalikes, 28)();
  }

  password: string;

  @BeforeInsert()
  async setPassword(): Promise<void> {
    if (this.password) {
      this.passwordHash = await bcrypt.hash(this.password, 10);
    }
  }
}
