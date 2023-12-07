import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateUpdateAuctionItemDto {
  @ApiProperty({
    description: 'The title of an auction item',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of an auction item',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The starting price of an auction item',
    minimum: 0,
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  start_price: number;

  @ApiProperty({
    description:
      'The end date of an auction item that can`t be set in the past',
  })
  @IsNotEmpty()
  @IsString()
  end_date: string;

  @ApiProperty({
    description: 'The image of an auction item',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
