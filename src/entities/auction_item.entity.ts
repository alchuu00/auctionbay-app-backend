import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { Bid } from './bid.entity';
import { User } from './user.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class AuctionItem extends Base {
  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  start_price: number;

  @Column({ nullable: true })
  end_date: string;

  @OneToMany(() => Bid, (bid) => bid.auction_item, { eager: true })
  bids: Bid[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
