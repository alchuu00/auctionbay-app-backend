import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RegisterUserDto } from './dto/register-user.dto';
import { hash } from 'bcrypt';
import { User } from 'src/entities/user.entity';
import Logging from 'src/library/Logging';
import { compareHash } from 'src/utils/bcrypt';
import { UsersService } from '../users/users.service';
import { RequestWithUser } from 'src/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
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
      role_id: null,
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
    return this.usersService.findById(data['id']);
  }

  async getUserId(request: RequestWithUser): Promise<string> {
    const user = request.user as User;
    return user.id;
  }
}
