import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { EmailChange } from './entities/email-change.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtPayload } from './jwt-payload.interface';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    @InjectRepository(EmailChange)
    private readonly emailChangeRepository: Repository<EmailChange>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signupAndLogin(
    signupRequest: SignupRequest,
    ip: string,
    deviceId: string,
  ): Promise<LoginResponse> {
    const createdUser = await this.signup(signupRequest, ip);
    return this.getLoginResponse(createdUser, deviceId, ip);
  }

  async signup(signupRequest: SignupRequest, ip: string): Promise<UserEntity> {
    const createdUser = await this.userService.createUser(signupRequest);

    const token = nanoid();

    const emailVerification = new EmailVerification();
    emailVerification.token = token;
    emailVerification.userId = createdUser.id;

    //valid for 2 days by default
    try {
      await this.emailVerificationRepository.insert(emailVerification);
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw new InternalServerErrorException(err);
    }

    await MailSenderService.sendVerifyEmailMail(
      signupRequest.name,
      signupRequest.email,
      token,
    );

    try {
      return createdUser;
    } catch (err) {
      Logger.error(err);
    }
  }

  async resendVerificationMail(
    name: string,
    email: string,
    userId: number,
  ): Promise<void> {
    // delete/nullify old email verification tokens if exist
    await this.emailVerificationRepository.delete({ userId });

    const token = nanoid();
    const emailVerification = new EmailVerification();
    emailVerification.token = token;
    emailVerification.userId = userId;

    // valid for 2 days by default
    await this.emailVerificationRepository.insert(emailVerification);

    await MailSenderService.sendVerifyEmailMail(
      name,
      email,
      emailVerification.token,
    );
  }

  async verifyEmail(token: string): Promise<void> {
    const emailVerification = await this.emailVerificationRepository
      .createQueryBuilder('emailVerification')
      .where('emailVerification.token=:token', { token })
      .andWhere('"emailVerification"."validUntil">=TIMEZONE(\'UTC\', NOW())')
      .select(['emailVerification.userId'])
      .getOne();

    if (emailVerification) {
      await Promise.all([
        this.userService.verifyEmail(emailVerification.userId),
        this.emailVerificationRepository.delete(token),
      ]);
    } else {
      Logger.log(`Verify email called with invalid email token ${token}`);
      throw new NotFoundException();
    }
  }

  async sendChangeEmailMail(
    changeEmailRequest: ChangeEmailRequest,
    userId: number,
    name: string,
    oldEmail: string,
  ): Promise<void> {
    // Check whether email is in use
    const userEntity = await this.userService.getUserEntityByEmail(
      changeEmailRequest.newEmail,
    );
    if (userEntity !== undefined) {
      Logger.log(
        `User with id ${userId} tried to change its email to already used ${changeEmailRequest.newEmail}`,
      );
      throw new ConflictException();
    }

    // delete old email change tokens if exist
    await this.emailChangeRepository.delete({ userId });

    const token = nanoid();
    const emailChange = new EmailChange();
    emailChange.token = token;
    emailChange.userId = userId;
    emailChange.newEmail = changeEmailRequest.newEmail;

    // valid for 2 days by default
    try {
      await this.emailChangeRepository.insert(emailChange);
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw new InternalServerErrorException(err);
    }

    await MailSenderService.sendChangeEmailMail(name, oldEmail, token);
  }

  async changeEmail(token: string): Promise<void> {
    const emailChange = await this.emailChangeRepository
      .createQueryBuilder('emailChange')
      .where('emailChange.token=:token', { token })
      .andWhere('"emailChange"."validUntil">=TIMEZONE(\'UTC\', NOW())')
      .select(['emailChange.userId', 'emailChange.newEmail'])
      .getOne();

    if (emailChange) {
      await Promise.all([
        this.userService.updateEmail(emailChange.userId, emailChange.newEmail),
        this.emailChangeRepository.delete(token),
      ]);
    } else {
      Logger.log(`Invalid email change token ${token} is rejected.`);
      throw new NotFoundException();
    }
  }

  async sendResetPasswordMail(email: string): Promise<void> {
    const userEntity = await this.userService.getUserEntityByUsername(email);
    if (userEntity === null || userEntity === undefined) {
      throw new NotFoundException();
    }

    const userId = userEntity.id;
    // Invalidate old token if exists
    await this.passwordResetRepository.delete({
      userId,
    });
    const token = nanoid();
    const passwordReset = new PasswordReset();
    passwordReset.token = token;
    passwordReset.userId = userId;
    // valid for 2 days by default
    try {
      await this.passwordResetRepository.insert(passwordReset);
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw new InternalServerErrorException(err);
    }

    await MailSenderService.sendResetPasswordMail(
      userEntity.name,
      userEntity.email,
      token,
    );
  }

  async resetPassword(
    resetPasswordRequest: ResetPasswordRequest,
  ): Promise<void> {
    const passwordResetEntity = await this.passwordResetRepository
      .createQueryBuilder('passwordReset')
      .where('passwordReset.token=:token', {
        token: resetPasswordRequest.token,
      })
      .andWhere('"passwordReset"."validUntil">=TIMEZONE(\'UTC\', NOW())')
      .select(['passwordReset.userId'])
      .getOne();

    if (passwordResetEntity) {
      await this.userService.updatePassword(
        passwordResetEntity.userId,
        await bcrypt.hash(resetPasswordRequest.newPassword, 10),
      );
      await this.passwordResetRepository.delete(resetPasswordRequest.token);
    } else {
      Logger.log(
        `Invalid reset password token ${resetPasswordRequest.token} is rejected`,
      );
      throw new NotFoundException();
    }
  }

  async changePassword(
    changePasswordRequest: ChangePasswordRequest,
    userId: number,
    name: string,
    email: string,
  ): Promise<void> {
    await this.userService.updatePassword(
      userId,
      await bcrypt.hash(changePasswordRequest.newPassword, 10),
    );

    await MailSenderService.sendPasswordChangeInfoMail(name, email);
  }

  async validateUser(payload: JwtPayload): Promise<UserEntity> {
    const userEntity = await this.userService.getUserEntityById(payload.id);
    if (
      userEntity &&
      userEntity.id === payload.id &&
      userEntity.email === payload.email &&
      userEntity.username === payload.username
    ) {
      return userEntity;
    }
    throw new UnauthorizedException();
  }

  async login(
    loginRequest: LoginRequest,
    ip: string,
    deviceId: string,
  ): Promise<LoginResponse> {
    const userEntity = await this.userService.getUserEntityByUsernameOrEmail(
      loginRequest.username,
    );

    if (
      userEntity === null ||
      userEntity === undefined ||
      !bcrypt.compareSync(loginRequest.password, userEntity.passwordHash)
    ) {
      throw new UnauthorizedException();
    }

    return this.getLoginResponse(userEntity, deviceId, ip);
  }

  async checkUsername(
    checkUsernameRequest: CheckUsernameRequest,
  ): Promise<CheckUsernameResponse> {
    const userEntity = await this.userService.getUserEntityByUsername(
      checkUsernameRequest.username,
    );
    return new CheckUsernameResponse(
      userEntity === null || userEntity === undefined,
    );
  }

  async checkEmail(
    checkEmailRequest: CheckEmailRequest,
  ): Promise<CheckEmailResponse> {
    const userEntity = await this.userService.getUserEntityByEmail(
      checkEmailRequest.email,
    );
    return new CheckEmailResponse(
      userEntity === null || userEntity === undefined,
    );
  }

  async validateRefreshToken(
    user: UserEntity,
    refreshToken: string,
    deviceId: string,
  ): Promise<UserEntity> {
    if (!user) {
      throw new UnauthorizedException();
    }
    const dbToken = await this.refreshTokenRepository.findOne({
      userId: user.id,
      deviceId: deviceId,
      token: refreshToken,
    });
    if (!dbToken) {
      throw new UnauthorizedException();
    }
    if (new Date() > dbToken.expiry) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async generateRefreshToken(
    userId: number,
    deviceId: string,
  ): Promise<string> {
    const refreshToken = nanoid();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 60);
    const token = await this.refreshTokenRepository.findOne({
      userId: userId,
      deviceId: deviceId,
    });
    try {
      if (token) {
        await this.refreshTokenRepository.update(token.token, {
          token: refreshToken,
          expiry: expiryDate,
        });
      } else {
        await this.refreshTokenRepository.save({
          token: refreshToken,
          expiry: expiryDate,
          deviceId: deviceId,
          userId: userId,
        });
      }
      return refreshToken;
    } catch (err) {
      Logger.error(JSON.stringify(err));
    }
  }

  async getLoginResponse(
    userEntity: UserEntity,
    deviceId: string,
    ip?: string,
  ): Promise<LoginResponse> {
    const payload: JwtPayload = {
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
    };

    const refreshToken = await this.generateRefreshToken(
      userEntity.id,
      deviceId,
    );
    const accessToken = await this.jwtService.signAsync(payload);

    return new LoginResponse(accessToken, refreshToken);
  }
}
