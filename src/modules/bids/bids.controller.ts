import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { Bid } from 'src/entities/bid.entity';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';

@Controller('bids')
@ApiTags('Bids')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token for authentication',
  required: true,
})
@UseInterceptors(ClassSerializerInterceptor)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post(':auctionItemId')
  @ApiOperation({ summary: 'Place a bid on an auction item' })
  @ApiParam({
    name: 'auctionItemId',
    type: String,
    description: 'ID of the auction item',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bidderId: { type: 'string', description: 'ID of the bidder' },
        bidAmount: { type: 'number', description: 'Amount of the bid' },
      },
    },
  })
  async placeBid(
    @Param('auctionItemId') auctionItemId: string,
    @Body('bidderId') bidderId: string,
    @Body('bidAmount') bidAmount: number,
  ): Promise<Bid> {
    return await this.bidsService.placeBid(auctionItemId, bidderId, bidAmount);
  }

  @Get(':auctionItemId')
  @ApiOperation({
    description: 'Retrieve all bids for a specific auction item',
  })
  @ApiParam({
    name: 'auctionItemId',
    description: 'The ID of the auction item',
  })
  async getBidsByAuctionItemId(
    @Param('auctionItemId') auctionItemId: string,
  ): Promise<Bid[]> {
    return await this.bidsService.getBidsByAuctionItemId(auctionItemId);
  }

  @Get('bidder/:bidderId')
  @ApiOperation({
    description: 'Retrieve all bids for a specific bidder',
  })
  @ApiParam({
    name: 'bidderId',
    description: 'The ID of the bidder',
  })
  async getBidsByBidderId(
    @Param('bidderId', new ParseUUIDPipe({ version: '4' })) bidderId: string,
  ): Promise<Bid[]> {
    return await this.bidsService.getBidsByBidderId(bidderId);
  }
}
