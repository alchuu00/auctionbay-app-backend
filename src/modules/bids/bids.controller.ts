import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { Bid } from 'src/entities/bid.entity';

@Controller('bids')
@UseInterceptors(ClassSerializerInterceptor)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  // handle POST request to place a bid
  @Post(':auctionItemId')
  async placeBid(
    @Param('auctionItemId') auctionItemId: string,
    @Body('bidderId') bidderId: string,
    @Body('bidAmount') bidAmount: number,
  ): Promise<Bid> {
    return await this.bidsService.placeBid(auctionItemId, bidderId, bidAmount);
  }

  // handle GET request to retrieve all bids for a specific auction item
  @Get(':auctionItemId')
  async getBidsByAuctionItemId(
    @Param('auctionItemId') auctionItemId: string,
  ): Promise<Bid[]> {
    return await this.bidsService.getBidsByAuctionItemId(auctionItemId);
  }

  // handle GET request to retrieve all bids for a specific bidder
  @Get('bidder/:bidderId')
  async getBidsByBidderId(@Param('bidderId') bidderId: string): Promise<Bid[]> {
    return await this.bidsService.getBidsByBidderId(bidderId);
  }

  // handle GET request to retrieve the winning bid for a specific auction item
  @Get(':auctionItemId/winning-bid')
  async getHighestBidder(
    @Param('auctionItemId') auctionItemId: string,
  ): Promise<Bid> {
    return await this.bidsService.getHighestBidder(auctionItemId);
  }
}
