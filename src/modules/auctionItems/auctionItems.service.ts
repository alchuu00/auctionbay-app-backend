import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import Logging from 'src/library/Logging';
import { CreateUpdateAuctionItemDto } from './dto/createUpdateAuctionItem.dto';
import { AuctionItem } from 'src/entities/auction_item.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuctionItemsService extends AbstractService {
  constructor(
    @InjectRepository(AuctionItem)
    private readonly auctionItemsRepository: Repository<AuctionItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(auctionItemsRepository);
  }

  async findWinning(userId: string): Promise<AuctionItem[]> {
    console.log('userId: ', userId);
    const status = 'Winning';
    try {
      const winnings = await this.auctionItemsRepository
        .createQueryBuilder()
        .select('auction_item')
        .from(AuctionItem, 'auction_item')
        .leftJoinAndSelect('auction_item.bids', 'bids')
        .where('bids.user_id = :userId', { userId })
        .andWhere('bids.status = :status', { status: status })
        .andWhere('auction_item.end_date < :now', { now: new Date() })
        .getMany();

      return winnings;
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for a paginated elements.',
      );
    }
  }

  async create(
    createAuctionItemDto: CreateUpdateAuctionItemDto,
    userId: string,
  ): Promise<AuctionItem> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const auctionItem = this.auctionItemsRepository.create({
        ...createAuctionItemDto,
        user: user,
      });
      return this.auctionItemsRepository.save(auctionItem);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while creating a new auction item.',
      );
    }
  }

  async update(
    auctionItemId: string,
    createUpdateAuctionItemDto: CreateUpdateAuctionItemDto,
  ): Promise<AuctionItem> {
    const auctionItem = (await this.findById(auctionItemId)) as AuctionItem;

    try {
      auctionItem.title = createUpdateAuctionItemDto.title;
      auctionItem.description = createUpdateAuctionItemDto.description;
      auctionItem.image = createUpdateAuctionItemDto.image;
      auctionItem.start_price = createUpdateAuctionItemDto.start_price;
      auctionItem.end_date = createUpdateAuctionItemDto.end_date;
      return this.auctionItemsRepository.save(auctionItem);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while updating the auction item.',
      );
    }
  }

  async updateAuctionItemImage(
    id: string,
    image: string,
  ): Promise<AuctionItem> {
    const auctionItem = await this.findById(id);

    return this.update(auctionItem.id, { ...auctionItem, image });
  }
}
