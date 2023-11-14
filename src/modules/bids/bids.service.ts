import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from 'src/entities/bid.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { UsersService } from '../users/users.service';
import { AuctionItemsService } from '../auctionItems/auctionItems.service';

@Injectable()
export class BidsService extends AbstractService {
  constructor(
    @InjectRepository(Bid) private readonly bidsRepository: Repository<Bid>,
    private readonly auctionItemsService: AuctionItemsService,
    private readonly usersService: UsersService,
  ) {
    super(bidsRepository);
  }

  async placeBid(
    auctionItemId: string,
    bidderId: string,
    bidAmount: number,
  ): Promise<Bid> {
    const auctionItem = await this.auctionItemsService.findById(auctionItemId);

    if (!auctionItem) {
      throw new NotFoundException('Auction item not found');
    }

    const bidder = await this.usersService.findById(bidderId);

    if (!bidder) {
      throw new NotFoundException('Bidder not found');
    }

    // Create a new bid and link it with the auction item and bidder
    const bid = new Bid();
    bid.auction_item = auctionItem;
    bid.bidder = bidder;
    bid.bid_amount = bidAmount;

    return await this.bidsRepository.save(bid);
  }

  async getBidsByAuctionItemId(auctionItemId: string): Promise<Bid[]> {
    const auctionItem = await this.auctionItemsService.findById(auctionItemId);

    if (!auctionItem) {
      throw new NotFoundException('Auction item not found');
    }

    // Retrieve all bids associated with the specified auction item
    return this.repository.find({
      where: { 'auction_item.id': auctionItemId },
      relations: ['auction_item', 'bidder'],
    });
  }

  async getBidsByBidderId(bidderId: string): Promise<Bid[]> {
    // Retrieve all bids associated with the specified bidder
    return this.repository.find({
      where: { 'bidder.id': bidderId },
      relations: ['auction_item', 'bidder'],
    });
  }

  async getHighestBidder(auctionItemId: string): Promise<Bid> {
    const auctionItem = await this.auctionItemsService.findById(auctionItemId);

    if (!auctionItem) {
      throw new NotFoundException('Auction item not found');
    }

    // Retrieve all bids associated with the specified auction item
    const bids = await this.repository.find({
      where: { 'auction_item.id': auctionItemId },
      relations: ['auction_item', 'bidder'],
    });

    // Sort bids by bid_amount in descending order
    bids.sort(
      (a: { bid_amount: number }, b: { bid_amount: number }) =>
        b.bid_amount - a.bid_amount,
    );

    // Return the bidder id of the first bid in the sorted array
    return bids[0]?.bidder?.id;
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
