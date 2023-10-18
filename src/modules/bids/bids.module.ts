import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from 'src/entities/bid.entity';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bid])],
  controllers: [BidsController],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule {}
