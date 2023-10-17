import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateUpdateAuctionItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  start_price: number;

  @IsNotEmpty()
  @IsString()
  end_date: string;

  @IsOptional()
  @IsString()
  image?: string;
}
