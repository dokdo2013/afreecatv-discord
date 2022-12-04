import { Module } from '@nestjs/common';
import { ImageService } from 'src/image/image.service';
import { BroadcastController } from './broadcast.controller';
import { BroadcastService } from './broadcast.service';

@Module({
  imports: [],
  controllers: [BroadcastController],
  providers: [BroadcastService, ImageService],
  exports: [BroadcastService],
})
export class BroadcastModule {}
