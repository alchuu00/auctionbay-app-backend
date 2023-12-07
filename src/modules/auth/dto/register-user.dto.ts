import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class RegisterUserDto {
  @IsOptional()
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  first_name?: string;

  @IsOptional()
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  last_name?: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Password must have at least one number, lower or upper case letter and it has to be longer than 5 characters.',
  })
  @ApiProperty({
    description: 'The password of the user',
    example: 'Password123',
  })
  password: string;

  @IsNotEmpty()
  @Match(RegisterUserDto, (field) => field.password, {
    message: 'Passwords do not match.',
  })
  @ApiProperty({
    description: 'The password confirmation',
    example: 'Password123',
  })
  confirm_password: string;
}
