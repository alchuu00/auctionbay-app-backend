import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuctionItem } from './auction_item.entity';
import { User } from './user.entity';
import { Base } from './base.entity';

@Entity()
export class Bid extends Base {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bid_amount: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  bidder: User;

  @ManyToOne(() => AuctionItem)
  @JoinColumn({ name: 'auction_item_id' })
  auction_item: AuctionItem;
  bid: { id: string };
}
