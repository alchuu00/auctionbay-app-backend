import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { hash } from 'bcrypt';
import { User } from 'src/entities/user.entity';
import Logging from 'src/library/Logging';
import { compareHash } from 'src/utils/bcrypt';
import { UsersService } from '../users/users.service';
import { RequestWithUser } from 'src/interfaces/auth.interface';
import sendResetEmail from 'src/utils/sendResetEmail';
import { TokenService } from '../token/token.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    Logging.info('Validating user...');
    const user = await this.usersService.findBy({ email: email });
    if (!user) {
      throw new BadRequestException('Invalid credentials.');
    }
    if (!(await compareHash(password, user.password))) {
      throw new BadRequestException('Invalid credentials.');
    }

    Logging.info('User is valid.');
    return user;
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword: string = await hash(registerUserDto.password, 10);
    const user = await this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
    });
    return user;
  }

  async generateJwt(user: User): Promise<string> {
    return this.jwtService.signAsync({ sub: user.id, name: user.email });
  }

  async user(cookie: string): Promise<User> {
    const data = await this.jwtService.verifyAsync(cookie);
    return this.usersService.findById(data['sub']);
  }

  async getUserId(request: RequestWithUser): Promise<string> {
    const user = request.user as User;
    return user.id;
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.usersService.findBy({ email });
    if (!user) {
      throw new Error('User not found');
    }
    const tokenValue = uuidv4();
    const token = await this.tokenService.create({
      token: tokenValue,
      email: user.email,
      userId: user.id,
    });
    sendResetEmail(
      email,
      'Password Reset Request',
      {
        name: user.first_name,
        id: user.id,
        token: token.token,
        link: `http://localhost:3000/reset-password/${token.token}`,
      },
      'resetPassword.handlebars',
    );
    return true;
  }
}
