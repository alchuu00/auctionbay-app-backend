import { Request } from 'express';
import { User } from 'src/entities/user.entity';

export interface TokenPayload {
  name: string;
  sub: string;
  type: JwtType;
}

export interface RequestWithUser extends Request {
  user: User;
}

export enum JwtType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
}
