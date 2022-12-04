import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty()
  url: string;
}
