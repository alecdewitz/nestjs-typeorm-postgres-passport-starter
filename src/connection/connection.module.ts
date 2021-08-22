import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from './../user/user.module';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { ConnectionEntity } from './entities/connection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConnectionEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UserModule,
  ],
  controllers: [ConnectionController],
  providers: [ConnectionService],
})
export class ConnectionModule {}
