import { Module } from '@nestjs/common';
import { AuctionItemsService } from './auctionItems.service';
import { AuctionItemsController } from './auctionItems.controller';
import { AuctionItem } from 'src/entities/auction_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Notification } from 'src/entities/notification.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionItem, User, Notification])],
  controllers: [AuctionItemsController],
  providers: [AuctionItemsService, NotificationsService],
  exports: [AuctionItemsService],
})
export class AuctionItemsModule {}
