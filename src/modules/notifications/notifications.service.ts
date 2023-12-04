import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';

@Injectable()
export class NotificationsService {
  private clients = [];

  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  addClient(client) {
    this.clients.push(client);
  }

  async createNotification(
    message: string,
    auctionItemImage: string,
    auctionItemTitle: string,
    bidStatus: string,
    bidAmount: number,
  ): Promise<Notification> {
    const notification = new Notification();
    notification.message = message;
    notification.auctionItemImage = auctionItemImage;
    notification.auctionItemTitle = auctionItemTitle;
    notification.bidStatus = bidStatus;
    notification.bidAmount = bidAmount;
    return this.notificationsRepository.save(notification);
  }

  async sendUpdates(data) {
    this.clients.forEach((client) =>
      client.write(`data: ${JSON.stringify(data)}\n\n`),
    );
  }
}
