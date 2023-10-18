import { Module } from '@nestjs/common';
import { AuctionItemsService } from './auctionItems.service';
import { AuctionItemsController } from './auctionItems.controller';
import { AuctionItem } from 'src/entities/auction_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionItem])],
  controllers: [AuctionItemsController],
  providers: [AuctionItemsService],
})
export class AuctionItemsModule {}
