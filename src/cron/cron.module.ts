import { Module } from '@nestjs/common';
import { BroadcastService } from 'src/broadcast/broadcast.service';
import { CronService } from './cron.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CronService, BroadcastService],
})
export class CronModule {}
