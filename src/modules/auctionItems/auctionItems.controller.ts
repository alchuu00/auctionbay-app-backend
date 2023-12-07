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
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiCookieAuth,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { parse } from 'cookie';
import { saveImageToStorage } from 'src/helpers/imageStorage';
import { PaginatedResult } from 'src/interfaces/paginated-results.interface';
import { AuctionItemsService } from './auctionItems.service';
import { AuctionItem } from 'src/entities/auction_item.entity';
import { CreateUpdateAuctionItemDto } from './dto/createUpdateAuctionItem.dto';
import { Request } from 'express';

@ApiTags('Auction Items')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token for authentication',
  required: true,
})
@Controller('auctionItems')
@UseInterceptors(ClassSerializerInterceptor)
export class AuctionItemsController {
  constructor(private readonly auctionItemsService: AuctionItemsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Retrieve a paginated list of auction items' })
  @ApiQuery({ name: 'page', description: 'The page number for pagination' })
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.auctionItemsService.paginate(page);
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Retrieve auction items by a specific user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  async findByUser(@Param('userId') userId: string): Promise<AuctionItem[]> {
    return this.auctionItemsService.fetchByUser(userId);
  }

  @Get('bidded/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Retrieve auction items bidded on by a specific user',
  })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  async findBidded(@Param('userId') userId: string): Promise<AuctionItem[]> {
    return this.auctionItemsService.findBidded(userId);
  }

  @Get('/won/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Retrieve auction items won by a specific user',
  })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  async findWon(@Param('userId') userId: string): Promise<AuctionItem[]> {
    return this.auctionItemsService.findWon(userId);
  }

  @Get('/winning/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Retrieve auction items currently winning by a specific user',
  })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  async findWinning(@Param('userId') userId: string): Promise<AuctionItem[]> {
    return this.auctionItemsService.findWinning(userId);
  }

  @Get('auction/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Retrieve an auction item with specific ID',
  })
  @ApiParam({ name: 'id', description: 'The ID of the auction item' })
  async findOne(@Param('id') id: string): Promise<AuctionItem> {
    return this.auctionItemsService.findAuctionByAuctionId(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: CreateUpdateAuctionItemDto,
    description: 'The auction item details',
  })
  @ApiCookieAuth('user_id')
  @ApiResponse({
    status: 201,
    description: 'The auction item has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description: 'Create a new auction item',
  })
  async create(
    @Body() createUpdateAuctionItemDto: CreateUpdateAuctionItemDto,
    @Req() req: Request,
  ): Promise<AuctionItem> {
    const cookies = parse(req.headers.cookie || ''); // Parse the cookies from the request headers
    const user_id = cookies['user_id']; // Access the user_id from the parsed cookies
    const userId = user_id;
    return this.auctionItemsService.create(createUpdateAuctionItemDto, userId);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image', saveImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The file to upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'The ID of the auction item' })
  @ApiResponse({
    status: 201,
    description: 'The image has been successfully uploaded.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image', saveImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description: 'Upload an image for an auction item',
  })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') auction_item_id: string,
  ): Promise<AuctionItem> {
    return await this.auctionItemsService.handleFileUpload(
      file,
      auction_item_id,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: CreateUpdateAuctionItemDto,
    description: 'The updated auction item details',
  })
  @ApiParam({ name: 'id', description: 'The ID of the auction item to update' })
  @ApiResponse({
    status: 200,
    description: 'The auction item has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Update an existing auction item',
  })
  async update(
    @Param('id') id: string,
    @Body() createUpdateAuctionItemDto: CreateUpdateAuctionItemDto,
  ): Promise<AuctionItem> {
    return this.auctionItemsService.update(id, createUpdateAuctionItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'The ID of the auction item to delete' })
  @ApiResponse({
    status: 200,
    description: 'The auction item has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Delete an existing auction item',
  })
  async remove(@Param('id') id: string): Promise<AuctionItem> {
    return this.auctionItemsService.remove(id);
  }
}
