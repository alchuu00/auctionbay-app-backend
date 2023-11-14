import { Module } from '@nestjs/common';
import { AuctionItemsService } from './auctionItems.service';
import { AuctionItemsController } from './auctionItems.controller';
import { AuctionItem } from 'src/entities/auction_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionItem, User])],
  controllers: [AuctionItemsController],
  providers: [AuctionItemsService],
  exports: [AuctionItemsService],
})
export class AuctionItemsModule {}
