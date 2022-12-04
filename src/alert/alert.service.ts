import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async getAlerts() {
    return 'getAlerts';
  }

  async getAlert() {
    return 'getAlert';
  }

  async createAlert() {
    return 'createAlert';
  }

  async deleteAlert() {
    return 'deleteAlert';
  }
}
