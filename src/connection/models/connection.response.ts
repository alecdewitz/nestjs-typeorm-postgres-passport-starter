import { ConnectionEntity } from './../entities/connection.entity';

export class ConnectionResponse {
  name: string;
  username: string;
  location: string;
  bio: string;
  date: Date;
  slug: string;
  status: string;

  constructor(connection: ConnectionEntity) {
    this.name = connection.contact.name;
    this.username = connection.contact.username;
    this.location = connection.contact.location;
    this.bio = connection.contact.bio;
    this.date = connection.created;
    this.slug = connection.slug;
    this.status = connection.status;
  }
}
