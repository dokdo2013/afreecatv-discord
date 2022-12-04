import { Controller, Get } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { SendDto } from './send.dto';

@Controller('broadcast')
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Get('publish')
  async publish(data: SendDto) {
    this.broadcastService.publish(data);
  }
}
