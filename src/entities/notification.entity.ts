import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Notification extends Base {
  @Column()
  message: string;

  @Column()
  auctionItemImage: string;

  @Column()
  auctionItemTitle: string;

  @Column()
  bidStatus: string;

  @Column()
  bidAmount: number;
}
