import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from 'src/entities/bid.entity';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { AuctionItemsModule } from '../auctionItems/auctionItems.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid]),
    AuctionItemsModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
