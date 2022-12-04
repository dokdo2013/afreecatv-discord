import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BroadcastService } from 'src/broadcast/broadcast.service';

@Injectable()
export class CronService {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Cron('45 * * * * *')
  handleCron() {
    // if environment variable 'DEV_MODE' is set to 'true', then don't use cron
    if (process.env.DEV_MODE === 'true') {
      console.log('DEV_MODE is on, not using cronjob');
      return;
    }
    this.broadcastService.broadcastChecker();
  }
}
