import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IpAddress } from 'src/user/ip-address.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { UserResponse } from '../user/models';
import { Usr } from '../user/user.decorator';
import { AuthService } from './auth.service';
import {
  ChangeEmailRequest,
  ChangePasswordRequest,
  CheckEmailRequest,
  CheckEmailResponse,
  CheckUsernameRequest,
  CheckUsernameResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  SignupRequest,
} from './models';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-refreshtoken'))
  @Post('refresh-token')
  async refreshToken(
    @Headers('x-device_id') deviceId: string,
    @Req() req: any,
    @Res() res: any,
  ): Promise<LoginResponse> {
    const loginResponse = await this.authService.getLoginResponse(
      req.user,
      deviceId,
    );

    // optional: set a cookie with the refresh token
    // res.cookie('refresh_token', loginResponse.refreshToken, {
    //   maxAge: 60 * 60 * 1000,
    //   httpOnly: true,
    //   secure: false,
    // });
    return res.send(loginResponse);
  }

  @HttpCode(HttpStatus.OK)
  @Post('check-username')
  async checkUsernameAvailability(
    @Body() checkUsernameRequest: CheckUsernameRequest,
  ): Promise<CheckUsernameResponse> {
    return this.authService.checkUsername(checkUsernameRequest);
  }

  @HttpCode(HttpStatus.OK)
  @Post('check-email')
  async checkEmailAvailability(
    @Body() checkEmailRequest: CheckEmailRequest,
  ): Promise<CheckEmailResponse> {
    return this.authService.checkEmail(checkEmailRequest);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Headers('x-device_id') deviceId: string,
    @Body() signupRequest: SignupRequest,
    @IpAddress() ip: string,
  ): Promise<LoginResponse> {
    return await this.authService.signupAndLogin(signupRequest, ip, deviceId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Headers('x-device_id') deviceId: string,
    @Body() loginRequest: LoginRequest,
    @IpAddress() ip: string,
    @Res() res: any,
  ): Promise<LoginResponse> {
    const loginResponse = await this.authService.login(
      loginRequest,
      ip,
      deviceId,
    );
    res.cookie('refresh_token', loginResponse.refreshToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });
    return res.send(loginResponse);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get()
  async getUserWithToken(@Usr() user: UserEntity): Promise<UserResponse> {
    return UserResponse.fromUserEntity(user);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<void> {
    await this.authService.verifyEmail(token);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  @Post('change-email')
  async sendChangeEmailMail(
    @Usr() user: UserEntity,
    @Body() changeEmailRequest: ChangeEmailRequest,
  ): Promise<void> {
    await this.authService.sendChangeEmailMail(
      changeEmailRequest,
      user.id,
      user.name,
      user.email,
    );
  }

  @Get('change-email')
  async changeEmail(@Query('token') token: string): Promise<void> {
    await this.authService.changeEmail(token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password/:email')
  async sendResetPassword(@Param('email') email: string): Promise<void> {
    await this.authService.sendResetPasswordMail(email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordRequest: ChangePasswordRequest,
    @Usr() user: UserEntity,
  ): Promise<void> {
    await this.authService.changePassword(
      changePasswordRequest,
      user.id,
      user.name,
      user.email,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordRequest: ResetPasswordRequest,
  ): Promise<void> {
    await this.authService.resetPassword(resetPasswordRequest);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  @Post('resend-verification')
  async resendVerificationMail(@Usr() user: UserEntity): Promise<void> {
    await this.authService.resendVerificationMail(
      user.name,
      user.email,
      user.id,
    );
  }
}
