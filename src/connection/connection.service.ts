import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './../user/entities/user.entity';
import { UserService } from './../user/user.service';
import { ConnectionEntity } from './entities/connection.entity';
import { ConnectionStatus } from './models/connection-status.enum';
import { ConnectionResponse } from './models/connection.response';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(ConnectionEntity)
    private connectionRepository: Repository<ConnectionEntity>,
    private readonly userService: UserService,
  ) {}

  async create(userId: number, contactSlug: string) {
    const connection = await this.findByUserSlug(userId, contactSlug);
    if (connection) {
      throw new ConflictException();
    }
    const contact = await this.userService.getUserBySlug(contactSlug);

    const newConnection = new ConnectionEntity();
    newConnection.userId = userId;
    newConnection.contact = contact;
    newConnection.status = ConnectionStatus.PENDING;
    await this.connectionRepository.save(newConnection);

    return new ConnectionResponse(newConnection);
  }

  async findAll(userId: number): Promise<ConnectionResponse[]> {
    const connections = await this.connectionRepository.find({
      where: { userId },
      relations: ['contact'],
    });
    return connections.map((connection) => {
      return new ConnectionResponse(connection);
    });
  }

  async findByUserIds(userId: number, contactId: number) {
    return await this.connectionRepository.findOne({
      where: { userId, contactId },
    });
  }

  async findByUserSlug(userId: number, userSlug: string) {
    const user = await this.connectionRepository
      .createQueryBuilder('connection')
      .leftJoin('connection.contact', 'contact')
      .where('connection.userId = :userId', { userId })
      .andWhere('contact.slug = :userSlug', { userSlug })
      .getOne();
    return user;
  }

  async findOne(user: UserEntity, slug: string): Promise<ConnectionResponse> {
    const connection = await this.connectionRepository
      .createQueryBuilder('connection')
      .leftJoinAndSelect('connection.contact', 'contact')
      .where('connection.slug = :slug', { slug })
      .andWhere('connection.userId = :userId', { userId: user.id })
      .getOne();

    if (!connection) {
      throw new Error('Connection not found');
    }
    return new ConnectionResponse(connection);
  }

  // async update(id: number, updateConnection: UpdateConnection) {
  //   return await this.connectionRepository.save(updateConnection);
  // }

  async remove(id: number) {
    return `This action removes a #${id} connection`;
  }
}
