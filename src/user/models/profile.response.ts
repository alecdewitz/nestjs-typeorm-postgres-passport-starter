import { UserEntity } from '../entities/user.entity';

export class ProfileResponse {
  slug: string;
  username: string;
  name: string;
  title: string;
  company: string;
  location: string;
  image: string | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  birthday: Date;

  isFollowing: boolean;

  constructor(user: UserEntity, currentUserId?: number) {
    const isMe = user.id === currentUserId;

    if (user.inverseConnections?.length > 0) {
      this.isFollowing = true;
    }

    this.slug = user.slug;
    this.username = user.username;
    this.image = user.image;
    this.name = user.name;
    this.location = user.location;
    this.bio = user.bio;

    if (this.isFollowing) {
      this.title = user.title;
      this.company = user.company;
      this.phone = user.phone;
      this.email = user.email;
      this.birthday = user.birthday;
    }
  }
}
