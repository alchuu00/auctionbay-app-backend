import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  first_name?: string;

  @IsOptional()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  role_id?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  confirm_password?: string;
}
