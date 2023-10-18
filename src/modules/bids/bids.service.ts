import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from 'src/entities/bid.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';

@Injectable()
export class BidsService extends AbstractService {
  constructor(
    @InjectRepository(Bid) private readonly bidsRepository: Repository<Bid>,
  ) {
    super(bidsRepository);
  }

  async placeBid(
    auctionItemId: string,
    bidderId: string,
    bidAmount: number,
  ): Promise<Bid> {
    const auctionItem = await this.findById(auctionItemId);

    if (!auctionItem) {
      throw new NotFoundException('Auction item not found');
    }

    // Create a new bid and link it with the auction item and bidder
    const bid = new Bid();
    bid.auction_item = auctionItem;
    bid.bidder = await this.findById(bidderId);

    bid.bid_amount = bidAmount;

    return await this.bidsRepository.save(bid);
  }

  async getBidsByAuctionItemId(auctionItemId: string): Promise<Bid[]> {
    const auctionItem = await this.findById(auctionItemId);

    if (!auctionItem) {
      throw new NotFoundException('Auction item not found');
    }

    // Retrieve all bids associated with the specified auction item
    return this.findById(auctionItemId, ['bids']);
  }

  async getBidsByBidderId(bidderId: string): Promise<Bid[]> {
    const bidder = await this.findById(bidderId);

    if (!bidder) {
      throw new NotFoundException('Bidder not found');
    }

    // Retrieve all bids associated with the specified bidder
    return this.findById(bidderId, ['bids']);
  }

  async getWinningBid(auctionItemId: string): Promise<Bid> {
    const auctionItem = await this.findById(auctionItemId);

    if (!auctionItem) {
      throw new NotFoundException('Auction item not found');
    }

    // Retrieve all bids associated with the specified auction item
    const bids = await this.findById(auctionItemId, ['bids']);

    // Sort bids by bid_amount in descending order
    bids.sort(
      (a: { bid_amount: number }, b: { bid_amount: number }) =>
        b.bid_amount - a.bid_amount,
    );

    // Return the first bid in the sorted array
    return bids[0];
  }

  async getAllBids(auctionItemId: string): Promise<Bid> {
    const auctionItem = await this.findById(auctionItemId);

    if (!auctionItem) {
      throw new NotFoundException('Auction item not found');
    }

    // Retrieve all bids associated with the specified auction item
    const bids = await this.findById(auctionItemId, ['bids']);

    return bids;
  }
}
