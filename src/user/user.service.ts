import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { SignupRequest } from '../auth/models';
import { UserEntity } from './entities/user.entity';
import { UpdateUserRequest } from './models';
import { ProfileResponse } from './models/profile.response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async setUserActive(username: string): Promise<void> {
    const user = await this.userRepository.findOne({ username });
    user.active = true;
    this.userRepository.save(user);
  }

  public async getUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  public async getUserProfile(
    username: string,
    user: UserEntity | null = null,
  ): Promise<ProfileResponse> {
    const normalizedUsername = username.toLowerCase();
    let q = this.userRepository.createQueryBuilder('user');
    q = q.leftJoinAndSelect('user.links', 'links');

    if (user) {
      q = q.leftJoinAndSelect(
        'user.inverseConnections',
        'inverseConnections',
        'inverseConnections.user = :userId',
        { userId: user?.id },
      );
    }

    q = q.where('user.username = :username', {
      username: normalizedUsername,
    });

    const viewedUser = await q.getOne();

    if (!viewedUser) {
      throw new NotFoundException();
    }

    return new ProfileResponse(viewedUser, user ? user.id : 0);
  }

  public async getUserEntityByUsernameOrEmail(
    identifier: string,
  ): Promise<UserEntity> {
    const normalizedIdentifier = identifier.toLowerCase();
    return this.userRepository.findOne({
      where: [
        { username: normalizedIdentifier },
        { email: normalizedIdentifier },
      ],
    });
  }

  public async getUserEntityByUsername(username: string): Promise<UserEntity> {
    const normalizedUsername = username.toLowerCase();
    return this.userRepository.findOne({
      where: { username: normalizedUsername },
    });
  }

  public async getUserEntityByEmail(email: string): Promise<UserEntity> {
    const normalizedEmail = email.toLowerCase();
    return this.userRepository.findOne({ where: { email: normalizedEmail } });
  }

  public async getUserEntityById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  public async getUserBySlug(slug: string): Promise<UserEntity> {
    return this.userRepository.findOne({ slug: slug });
  }

  public async getSearchResults(
    user: UserEntity,
    query: string = '',
  ): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: [
        {
          name: Raw(
            (alias) => `LOWER(${alias}) Like '%${query.toLowerCase()}%'`,
          ),
          active: true,
        },
        {
          username: Raw(
            (alias) => `LOWER(${alias}) Like '%${query.toLowerCase()}%'`,
          ),
          active: true,
        },
      ],
      take: 8,
    });
  }

  public async createUser(signupRequest: SignupRequest): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.username = signupRequest.username;
    newUser.email = signupRequest.email;
    newUser.password = signupRequest.password;
    newUser.active = true;
    newUser.name = signupRequest.name;
    try {
      // insert also updates id of newUser, we can directly return newUser
      await this.userRepository.insert(newUser);
      return newUser;
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw new ConflictException();
    }
  }

  public async updatePassword(
    userId: number,
    passwordHash: string,
  ): Promise<void> {
    const userEntity = await this.userRepository.findOne(userId);
    if (userEntity === null || userEntity === undefined) {
      Logger.warn(
        `Password change of non-existent account with id ${userId} is rejected.`,
      );
      throw new NotFoundException();
    }
    await this.userRepository.update(userEntity.id, { passwordHash });
  }

  async updateUser(
    userId: number,
    updateRequest: UpdateUserRequest,
  ): Promise<void> {
    try {
      // only update fields that are not null
      Object.keys(updateRequest).forEach(
        (key) => updateRequest[key] == null && delete updateRequest[key],
      );

      await this.userRepository.update(userId, updateRequest);
    } catch (err) {
      Logger.warn(JSON.stringify(err));
      throw new BadRequestException();
    }
  }

  async updateEmail(userId: number, email: string): Promise<void> {
    await this.userRepository.update(userId, { email });
  }

  async verifyEmail(userId: number): Promise<void> {
    await this.userRepository.update(userId, { emailVerified: true });
  }
}
