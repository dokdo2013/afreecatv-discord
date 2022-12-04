import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BroadcastService } from 'src/broadcast/broadcast.service';

@Injectable()
export class CronService {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Cron('45 * * * * *')
  handleCron() {
    this.broadcastService.broadcastChecker();
  }
}
