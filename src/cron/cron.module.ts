import { Module } from '@nestjs/common';
import { BroadcastService } from 'src/broadcast/broadcast.service';
import { ImageService } from 'src/image/image.service';
import { CronService } from './cron.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CronService, BroadcastService, ImageService],
})
export class CronModule {}
