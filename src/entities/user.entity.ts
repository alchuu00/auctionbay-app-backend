import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { Bid } from './bid.entity';

@Entity()
export class User extends Base {
  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @OneToMany(() => Bid, (bid) => bid.bidder)
  bids: Bid[];
}
