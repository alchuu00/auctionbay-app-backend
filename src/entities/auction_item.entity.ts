import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { Bid } from './bid.entity';
import { User } from './user.entity';

@Entity()
export class AuctionItem extends Base {
  @ApiProperty({
    description: 'The title of the auction item',
    example: 'Vintage Vase',
    nullable: true,
  })
  @Column({ nullable: true })
  title: string;

  @ApiProperty({
    description: 'The description of the auction item',
    example: 'A beautiful vintage vase',
    nullable: true,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'The image of the auction item',
    example: 'vase.jpg',
    nullable: true,
  })
  @Column({ nullable: true })
  image?: string;

  @ApiProperty({
    description: 'The start price of the auction item',
    example: 100,
    nullable: true,
  })
  @Column({ nullable: true })
  start_price: number;

  @ApiProperty({
    description: 'The end date of the auction item',
    example: '2022-12-31',
    nullable: true,
  })
  @Column({ nullable: true })
  end_date: string;

  @ApiProperty({
    description: 'The bids for the auction item',
    type: () => [Bid],
  })
  @OneToMany(() => Bid, (bid) => bid.auction_item, {
    eager: true,
  })
  bids: Bid[];

  @ApiProperty({
    description: 'The user who posted the auction item',
    type: () => User,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
