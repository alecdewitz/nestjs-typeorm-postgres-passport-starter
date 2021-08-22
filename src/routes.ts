import { Routes } from 'nest-router';
import { AuthModule } from './auth/auth.module';
import { ConnectionModule } from './connection/connection.module';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';

export const routes: Routes = [
  {
    path: '/api',
    children: [
      {
        path: '/v1',
        children: [
          {
            path: '/user',
            module: UserModule,
          },
          {
            path: '/auth',
            module: AuthModule,
          },
          {
            path: '/connections',
            module: ConnectionModule,
          },
          {
            path: '/notifications',
            module: NotificationModule,
          },
        ],
      },
    ],
  },
];
