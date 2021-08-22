import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [NotificationService],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
