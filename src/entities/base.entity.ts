import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class Base {
  @ApiProperty({
    description: 'The unique identifier of the entity',
    example: '3fa85f64562b3fc2c963f66afa6',
  })
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The creation date of the entity',
    example: '2022-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  @Expose()
  created_at: Date;

  @ApiProperty({
    description: 'The update date of the entity',
    example: '2022-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  @Expose()
  updated_at: Date;
}
