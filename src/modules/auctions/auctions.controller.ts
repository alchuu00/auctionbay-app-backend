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
import { Auction } from 'src/entities/auction.entity';
import {
  saveImageToStorage,
  isFileExtensionSafe,
  removeFile,
} from 'src/helpers/imageStorage';
import { PaginatedResult } from 'src/interfaces/paginated-results.interface';
import { AuctionsService } from './auctions.service';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { CreateAuctionDto } from './dto/create-auction.dto';

@ApiTags('auctions')
@Controller('auctions')
@UseInterceptors(ClassSerializerInterceptor)
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  // handle GET request to retrieve a paginated list of auctions
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.auctionsService.paginate(page);
  }

  // handle GET request to retrieve a auction with a specific id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Auction> {
    return this.auctionsService.findById(id);
  }

  // handle POST request to create a new auction
  @ApiCreatedResponse({ description: 'Creates new auction.' })
  @ApiBadRequestResponse({ description: 'Error for creating a new auction.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAuctionDto: CreateAuctionDto): Promise<Auction> {
    return this.auctionsService.create(createAuctionDto);
  }

  // handle POST request to upload auction item image
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image', { storage: saveImageToStorage }))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File, // Extract the uploaded file from the request
    @Param('id') auction_item_id: string, // Extract the auction ID from the request URL
  ): Promise<Auction> {
    const filename = file?.filename; // Extract the filename of the uploaded file from the file object

    if (!filename) {
      // Throw a BadRequestException if the uploaded file does not have a valid filename
      throw new BadRequestException('File must be a png, jpg/jpeg');
    }

    const imagesFolderPath = join(process.cwd(), 'files'); // Define the path to the folder where uploaded images will be stored
    const fullImagePath = join(imagesFolderPath + '/' + file.filename); // Define the full path to the uploaded image file

    if (await isFileExtensionSafe(fullImagePath)) {
      // Check if the uploaded file has a safe file extension
      return this.auctionsService.updateAuctionImageId(
        auction_item_id,
        filename,
      ); // Call the updateUserImageId method of the auctionsService instance to update the user's avatar image ID in the database
    }

    removeFile(fullImagePath); // Remove the uploaded file from the file system if it does not have a safe file extension
    throw new BadRequestException('File content does not match extension!'); // Throw a BadRequestException if the uploaded file does not have a safe file extension
  }

  // handle PATCH request to update auction information
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateAuctionDto: UpdateAuctionDto,
  ): Promise<Auction> {
    return this.auctionsService.update(id, updateAuctionDto);
  }

  // handle DELETE request to delete an auction with a specific id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<Auction> {
    return this.auctionsService.remove(id);
  }
}
