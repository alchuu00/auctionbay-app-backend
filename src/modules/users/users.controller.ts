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
  Patch,
  Delete,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { PaginatedResult } from 'src/interfaces/paginated-results.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import {
  saveImageToStorage,
  isFileExtensionSafe,
  removeFile,
} from 'src/helpers/imageStorage';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({ description: 'List all users.' })
  @ApiBadRequestResponse({ description: 'Error for list of users.' })
  @ApiOperation({ summary: 'List all users.' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.usersService.paginate(page);
  }

  @Get(':id')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by id.' })
  @ApiParam({ name: 'id', required: true, description: 'User id' })
  @ApiBody({ type: User })
  @ApiResponse({
    status: 200,
    description: 'User fetched successfully.',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Error for get user by id.' })
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @ApiCreatedResponse({ description: 'Creates new user.' })
  @ApiBadRequestResponse({ description: 'Error for creating a new user.' })
  @ApiOperation({ summary: 'Create new user.' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: User,
  })
  @ApiBody({ type: CreateUserDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('avatar', saveImageToStorage))
  @ApiOperation({ summary: 'Upload avatar image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User avatar',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 201, description: 'Avatar uploaded successfully.' })
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File, // Extract the uploaded file from the request
    @Param('id') id: string, // Extract the user ID from the request URL
  ): Promise<User> {
    const filename = file?.filename; // Extract the filename of the uploaded file from the file object

    if (!filename) {
      // Throw a BadRequestException if the uploaded file does not have a valid filename
      throw new BadRequestException('File must be a png, jpg/jpeg');
    }

    const imagesFolderPath = join(process.cwd(), 'files'); // Define the path to the folder where uploaded images will be stored
    const fullImagePath = join(imagesFolderPath + '/' + file.filename); // Define the full path to the uploaded image file

    if (await isFileExtensionSafe(fullImagePath)) {
      const oldImageId = await this.usersService.getUserImageId(id);
      const result = await this.usersService.updateUserImageId(id, filename); // Call the updateUserImageId method of the usersService instance to update the user's avatar image ID in the database
      if (oldImageId) {
        const oldImagePath = join(imagesFolderPath + '/' + oldImageId); // Define the full path to the old avatar image file
        removeFile(oldImagePath); // Remove the old avatar image from the file system
      }
      return result;
    }

    removeFile(fullImagePath); // Remove the uploaded file from the file system if it does not have a safe file extension
    throw new BadRequestException('File content does not match extension!'); // Throw a BadRequestException if the uploaded file does not have a safe file extension
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user information.' })
  @ApiParam({ name: 'id', required: true, description: 'User id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Error for update user information.' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id.' })
  @ApiParam({ name: 'id', required: true, description: 'User id' })
  @ApiBody({ type: User })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Error for delete user by id.' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
