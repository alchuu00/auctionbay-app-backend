import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';
import { AbstractService } from '../common/abstract.service';

@Injectable()
export class NotificationsService extends AbstractService {
  private clients = [];

  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {
    super(notificationsRepository);
  }

  addClient(client) {
    this.clients.push(client);
  }

  async createNotification(notification): Promise<Notification> {
    const savedNotification = await this.notificationsRepository.save(
      notification,
    );

    return savedNotification;
  }

  async sendUpdates(data) {
    this.clients.forEach((client) =>
      client.write(`data: ${JSON.stringify(data)}\n\n`),
    );
  }
}
