import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { Exclude, Expose } from 'class-transformer';
import { AuctionItem } from './auction_item.entity';

@Entity()
export class Auction extends Base {
  @Column()
  @Exclude()
  first_name: string;

  @Column()
  @Exclude()
  last_name: string;

  @Column()
  email: string;

  @OneToMany(() => AuctionItem, (auctionItem) => auctionItem.auction)
  auction_items: AuctionItem[];

  @Expose()
  get name(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}
