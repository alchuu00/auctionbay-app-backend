import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
  })
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    description: 'The last name of the user',
  })
  @IsOptional()
  last_name?: string;

  @ApiProperty({
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Password must have at least one number, lower or upper case letter and it has to be longer than 5 characters.',
  })
  password: string;

  @ApiProperty({
    description: 'Confirmation of the password',
  })
  @IsNotEmpty()
  @Match(CreateUserDto, (field) => field.password, {
    message: 'Passwords do not match.',
  })
  confirm_password: string;
}
