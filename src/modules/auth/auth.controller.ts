import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/entities/user.entity';
import { RequestWithUser } from 'src/interfaces/auth.interface';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const access_token = await this.authService.generateJwt(req.user);
    res.cookie('access_token', access_token, { httpOnly: true });
    return req.user;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async user(@Req() req: Request): Promise<User> {
    const cookie = req.cookies['access_token'];
    return this.authService.user(cookie);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
  }
}
