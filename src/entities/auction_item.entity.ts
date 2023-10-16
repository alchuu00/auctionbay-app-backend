import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { Auction } from './auction.entity';

@Entity()
export class AuctionItem extends Base {
  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  start_price: number;

  @Column({ nullable: true })
  end_date: string;

  @ManyToOne(() => Auction, (auction) => auction.auction_items)
  @JoinColumn({ name: 'auction_id' })
  auction: Auction;
}
