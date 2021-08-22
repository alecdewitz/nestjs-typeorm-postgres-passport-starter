import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
