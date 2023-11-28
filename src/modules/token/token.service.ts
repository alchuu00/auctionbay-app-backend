import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/entities/token.entity';
import sendResetEmail from 'src/utils/sendResetEmail';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { template } from 'handlebars';
import { UsersService } from '../users/users.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private usersService: UsersService,
  ) {}

  async findOne(tokenQuery): Promise<string> {
    const tokenEntity = await this.tokenRepository.findOne(tokenQuery);
    return tokenEntity.userId;
  }

  async deleteOne(tokenQuery): Promise<void> {
    const token = await this.tokenRepository.findOne(tokenQuery);
    if (token) {
      await this.tokenRepository.remove(token);
    }
  }

  async create(data: {
    token: string;
    email?: string;
    userId?: string;
  }): Promise<Token> {
    const token = this.tokenRepository.create(data);
    return this.tokenRepository.save(token);
  }

  async resetPassword(userId, token, updateUserDto) {
    console.log('userId:', userId);
    console.log('token:', token);
    console.log('updateUserDto:', updateUserDto);

    const passwordResetToken = await this.tokenRepository.findOne({
      where: { token: token },
    });

    console.log('passwordResetToken:', passwordResetToken.token);

    if (!passwordResetToken.token) {
      throw new Error('Invalid or expired password reset token');
    }

    let isValid = false;

    if (token === passwordResetToken.token) {
      isValid = true;
    }

    console.log('isValid:', isValid);

    if (!isValid) {
      throw new Error('Invalid or expired password reset token');
    }

    const user = await this.usersService.findById(userId);

    console.log('user:', user);

    await this.usersService.update(userId, updateUserDto);

    sendResetEmail(
      user.email,
      'Password Reset Successfully',
      {
        name: user.first_name,
      },
      'resetSuccess.handlebars',
    );

    await this.deleteOne({
      where: { token: token.token },
    });
  }
}
