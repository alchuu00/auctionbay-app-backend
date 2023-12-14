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
import {
  ApiBadGatewayResponse,
  ApiBody,
  ApiCookieAuth,
  ApiHeader,
  ApiHeaders,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { string } from '@hapi/joi';

interface LoginResponse {
  user: User;
  access_token: string;
}

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiOkResponse({
    type: RegisterUserDto,
    description: 'User registered successfully',
  })
  async register(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const newUser = await this.authService.register(body);
    const access_token = await this.authService.generateJwt(newUser);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.cookie('user_id', newUser.id);
    return { user: newUser, access_token };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({
    type: LoginUserDto,
    description: 'User logged in successfully',
  })
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const access_token = await this.authService.generateJwt(req.user);
    res.cookie('access_token', access_token, { httpOnly: true });
    res.cookie('user_id', req.user.id);
    return { user: req.user, access_token };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Get user information' })
  @ApiBody({ type: User })
  @ApiOkResponse({ type: User, description: 'User information' })
  async user(@Req() req: Request): Promise<User> {
    const cookie = req.cookies['access_token'];
    return this.authService.user(cookie);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign out a user' })
  @ApiOkResponse({ description: 'User signed out successfully' })
  signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('user_id');
  }

  @Public()
  @Post('send-password-reset-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiOkResponse({ description: 'Password reset email sent successfully' })
  async sendPasswordResetEmail(@Req() req: RequestWithUser): Promise<void> {
    const { email } = req.body;
    await this.authService.sendPasswordResetEmail(email);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiOkResponse({ description: 'Token refreshed successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  async refreshToken(
    @Req() req: RequestWithUser,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = req.body;
    const accessToken = await this.authService.refreshToken(refreshToken);
    return { accessToken };
  }
}
