import { UserEntity } from '../entities/user.entity';

export class UserResponse {
  slug: string;
  username: string;
  email: string;
  emailVerified: boolean;
  active: boolean;
  name: string;
  title: string;
  company: string;
  location: string;
  image: string;
  phone: string;
  bio: string;
  birthday: Date;
  joined: Date;

  static fromUserEntity(entity: UserEntity): UserResponse {
    const response = new UserResponse();
    response.slug = entity.slug;
    response.username = entity.username;
    response.email = entity.email;
    response.emailVerified = entity.emailVerified;
    response.active = entity.active;
    response.name = entity.name;
    response.title = entity.title;
    response.company = entity.company;
    response.location = entity.location;
    response.bio = entity.bio;
    response.phone = entity.phone;
    response.image = entity.image;
    response.birthday = entity.birthday;
    response.joined = entity.created;
    return response;
  }
}
