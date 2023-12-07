import { IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty({ description: 'First name of the user', required: false })
  first_name?: string;

  @IsOptional()
  @ApiProperty({ description: 'Last name of the user', required: false })
  last_name?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ description: 'Email of the user', required: false })
  email?: string;

  @IsOptional()
  @ApiProperty({ description: 'Role ID of the user', required: false })
  role_id?: string;

  @IsOptional()
  @ApiProperty({ description: 'Avatar of the user', required: false })
  avatar?: string;

  @IsOptional()
  @ApiProperty({ description: 'Password of the user', required: false })
  password?: string;

  @IsOptional()
  @ApiProperty({ description: 'Confirmation of the password', required: false })
  confirm_password?: string;
}
