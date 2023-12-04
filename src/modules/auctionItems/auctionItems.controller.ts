import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  Post,
  Body,
  UploadedFile,
  BadRequestException,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { join } from 'path';
import { parse } from 'cookie';
import {
  saveImageToStorage,
  isFileExtensionSafe,
  removeFile,
} from 'src/helpers/imageStorage';
import { PaginatedResult } from 'src/interfaces/paginated-results.interface';
import { AuctionItemsService } from './auctionItems.service';
import { AuctionItem } from 'src/entities/auction_item.entity';
import { CreateUpdateAuctionItemDto } from './dto/createUpdateAuctionItem.dto';
import { Request } from 'express';

@ApiTags('auctionItems')
@Controller('auctionItems')
@UseInterceptors(ClassSerializerInterceptor)
export class AuctionItemsController {
  constructor(private readonly auctionItemsService: AuctionItemsService) {}

  // handle GET request to retrieve a paginated list of auction items
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.auctionItemsService.paginate(page);
  }

  // handle GET request to retrieve auction items by a specific user
  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async findByUser(@Param('userId') userId: string): Promise<AuctionItem[]> {
    return this.auctionItemsService.fetchByUser(userId);
  }

  // handle GET request to retrieve auctions bidded on by a specific user
  @Get('bidded/:userId')
  @HttpCode(HttpStatus.OK)
  async findBidded(@Param('userId') userId: string): Promise<AuctionItem[]> {
    return this.auctionItemsService.findBidded(userId);
  }

  // handle GET request to retrieve auctions won by a specific user
  @Get('/won/:userId')
  @HttpCode(HttpStatus.OK)
  async findWon(@Param('userId') userId: string): Promise<AuctionItem[]> {
    return this.auctionItemsService.findWon(userId);
  }

  // handle GET request to retrieve auctions currently winning by a specific user
  @Get('/winning/:userId')
  @HttpCode(HttpStatus.OK)
  async findWinning(@Param('userId') userId: string): Promise<AuctionItem[]> {
    return this.auctionItemsService.findWinning(userId);
  }

  // handle GET request to retrieve an auction item with a specific id
  @Get('auction/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<AuctionItem> {
    return this.auctionItemsService.findAuctionByAuctionId(id);
  }

  // handle POST request to create a new auction item
  @ApiCreatedResponse({ description: 'Creates new auction.' })
  @ApiBadRequestResponse({ description: 'Error for creating a new auction.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUpdateAuctionItemDto: CreateUpdateAuctionItemDto,
    @Req() req: Request,
  ): Promise<AuctionItem> {
    const cookies = parse(req.headers.cookie || ''); // Parse the cookies from the request headers
    const user_id = cookies['user_id']; // Access the user_id from the parsed cookies
    const userId = user_id;
    return this.auctionItemsService.create(createUpdateAuctionItemDto, userId);
  }

  // handle POST request to upload auction item image
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image', saveImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') auction_item_id: string,
  ): Promise<AuctionItem> {
    return await this.auctionItemsService.handleFileUpload(
      file,
      auction_item_id,
    );
  }

  // handle PATCH request to update auction item information
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() createUpdateAuctionItemDto: CreateUpdateAuctionItemDto,
  ): Promise<AuctionItem> {
    return this.auctionItemsService.update(id, createUpdateAuctionItemDto);
  }

  // handle DELETE request to delete an auction item with a specific id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<AuctionItem> {
    return this.auctionItemsService.remove(id);
  }
}
