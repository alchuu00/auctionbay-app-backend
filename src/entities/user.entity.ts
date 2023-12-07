import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { Bid } from './bid.entity';
import { AuctionItem } from './auction_item.entity';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends Base {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    nullable: true,
  })
  @Column({ nullable: true })
  first_name: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    nullable: true,
  })
  @Column({ nullable: true })
  last_name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'The avatar of the user',
    example: 'avatar.jpg',
    nullable: true,
  })
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    nullable: true,
  })
  @Column({ nullable: true })
  @Exclude()
  password: string;

  @ApiProperty({
    type: () => [AuctionItem],
    description: 'The auction items of the user',
  })
  @OneToMany(() => AuctionItem, (auction_item) => auction_item.user)
  auction_items: AuctionItem[];

  @ApiProperty({ type: () => [Bid], description: 'The bids of the user' })
  @OneToMany(() => Bid, (bid) => bid.bidder)
  bids: Bid[];
}
