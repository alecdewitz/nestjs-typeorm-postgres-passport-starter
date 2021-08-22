import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../config';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refreshtoken',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.jwt.secretOrKey,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload): Promise<UserEntity> {
    const user = await this.authService.validateUser(payload);
    await this.authService.validateRefreshToken(
      user,
      req.body.refreshToken,
      req.headers['x-device_id'],
    );
    return user;
  }
}
