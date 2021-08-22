import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from 'nest-router';
import { AuthModule } from './auth/auth.module';
import { ConnectionModule } from './connection/connection.module';
import { MailSenderModule } from './mail-sender/mail-sender.module';
import { NotificationModule } from './notification/notification.module';
import { routes } from './routes';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    AuthModule,
    TypeOrmModule.forRoot(),
    UserModule,
    MailSenderModule,
    ConnectionModule,
    NotificationModule,
  ],

  providers: [],
})
export class AppModule {}
