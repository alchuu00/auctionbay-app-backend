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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { join } from 'path';
import {
  saveImageToStorage,
  isFileExtensionSafe,
  removeFile,
} from 'src/helpers/imageStorage';
import { PaginatedResult } from 'src/interfaces/paginated-results.interface';
import { AuctionItemsService } from './auctionItems.service';
import { AuctionItem } from 'src/entities/auction_item.entity';
import { CreateUpdateAuctionItemDto } from './dto/createUpdateAuctionItem.dto';

@ApiTags('auctionItems')
@Controller('auctionItems')
@UseInterceptors(ClassSerializerInterceptor)
export class AuctionItemsController {
  constructor(private readonly auctionItemsService: AuctionItemsService) {}

  // handle GET request to retrieve a paginated list of auction items
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    console.log('paginate auction items');
    return this.auctionItemsService.paginate(page);
  }

  // handle GET request to retrieve an auction item with a specific id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<AuctionItem> {
    return this.auctionItemsService.findById(id);
  }

  // handle POST request to create a new auction item
  @ApiCreatedResponse({ description: 'Creates new auction.' })
  @ApiBadRequestResponse({ description: 'Error for creating a new auction.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUpdateAuctionItemDto: CreateUpdateAuctionItemDto,
  ): Promise<AuctionItem> {
    return this.auctionItemsService.create(createUpdateAuctionItemDto);
  }

  // handle POST request to upload auction item image
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image', { storage: saveImageToStorage }))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File, // Extract the uploaded file from the request
    @Param('id') auction_item_id: string, // Extract the auction ID from the request URL
  ): Promise<AuctionItem> {
    const filename = file?.filename; // Extract the filename of the uploaded file from the file object

    if (!filename) {
      // Throw a BadRequestException if the uploaded file does not have a valid filename
      throw new BadRequestException('File must be a png, jpg/jpeg');
    }

    const imagesFolderPath = join(process.cwd(), 'files'); // Define the path to the folder where uploaded images will be stored
    const fullImagePath = join(imagesFolderPath + '/' + file.filename); // Define the full path to the uploaded image file

    if (await isFileExtensionSafe(fullImagePath)) {
      // Check if the uploaded file has a safe file extension
      return this.auctionItemsService.updateAuctionItemImage(
        auction_item_id,
        filename,
      ); // Call the updateAuctionItemImageId method of the auctionsService instance to update the AuctionItem's image ID in the database
    }

    removeFile(fullImagePath); // Remove the uploaded file from the file system if it does not have a safe file extension
    throw new BadRequestException('File content does not match extension!'); // Throw a BadRequestException if the uploaded file does not have a safe file extension
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
