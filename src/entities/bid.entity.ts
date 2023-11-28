import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuctionItem } from './auction_item.entity';
import { User } from './user.entity';
import { Base } from './base.entity';

@Entity()
export class Bid extends Base {
  @Column({ type: 'int' })
  bid_amount: number;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  bidder: User;

  @ManyToOne(() => AuctionItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auction_item_id' })
  auction_item: AuctionItem;
}
