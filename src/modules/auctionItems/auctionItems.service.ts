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

@Injectable()
export class AuctionItemsService extends AbstractService {
  constructor(
    @InjectRepository(AuctionItem)
    private readonly auctionItemsRepository: Repository<AuctionItem>,
  ) {
    super(auctionItemsRepository);
  }

  async create(
    createAuctionItemDto: CreateUpdateAuctionItemDto,
  ): Promise<AuctionItem> {
    try {
      const auctionItem =
        this.auctionItemsRepository.create(createAuctionItemDto);
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
