import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiBody({ type: CreateImageDto })
  async createImage(@Body() image: CreateImageDto): Promise<string> {
    return await this.imageService.uploadImageFromUrl(image.url);
  }
}
