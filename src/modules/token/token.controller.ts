import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from '../users/users.service';

@Controller('reset-password')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {}

  @Get(':token')
  @Public()
  async findOne(@Param('token') token: string): Promise<string> {
    return this.tokenService.findOne({ where: { token } });
  }

  @Delete(':token')
  @Public()
  async deleteOne(@Param('token') token: string): Promise<void> {
    return this.tokenService.deleteOne({ token });
  }

  @Patch(':id')
  @Public()
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('id') id: string,
    @Body() { updateUserDto, token },
  ) {
    console.log('id:', id);
    console.log('updateUserDto:', updateUserDto);
    console.log('token:', token);
    await this.tokenService.resetPassword(id, token, updateUserDto);
  }
}
