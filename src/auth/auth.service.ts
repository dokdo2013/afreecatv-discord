import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async validateUser(username: string, pass: string): Promise<boolean> {
    return true;
  }
}
