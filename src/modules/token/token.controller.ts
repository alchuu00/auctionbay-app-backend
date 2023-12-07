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
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Controller('reset-password')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get(':token')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find token in database' })
  @ApiResponse({ status: 200, description: 'Token found successfully.' })
  @ApiResponse({ status: 404, description: 'Token not found.' })
  async findOne(@Param('token') token: string): Promise<string> {
    return this.tokenService.findOne({ where: { token } });
  }

  @Delete(':token')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete token from database' })
  @ApiResponse({ status: 200, description: 'Token deleted successfully.' })
  async deleteOne(@Param('token') token: string): Promise<void> {
    return this.tokenService.deleteOne({ token });
  }

  @Patch(':id')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'The updated user details',
  })
  async resetPassword(
    @Param('id') id: string,
    @Body() { updateUserDto, token },
  ) {
    await this.tokenService.resetPassword(id, token, updateUserDto);
  }
}
