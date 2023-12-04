import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Notification extends Base {
  @Column()
  message: string;

  @Column({ nullable: true })
  auctionItemImage?: string;

  @Column()
  auctionItemTitle: string;

  @Column({ nullable: true })
  bidAmount?: number;
}
