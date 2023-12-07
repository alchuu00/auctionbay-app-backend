import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Token extends Base {
  @ApiProperty({ description: 'The token string' })
  @Column()
  token: string;

  @ApiProperty({
    description: 'The email associated with the token',
    nullable: true,
  })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({
    description: 'The user ID associated with the token',
    nullable: true,
  })
  @Column({ nullable: true })
  userId: string;
}
