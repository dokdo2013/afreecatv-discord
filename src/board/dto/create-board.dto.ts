import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({
    description: '게시판 이름',
    type: String,
    example: '자유게시판',
  })
  title: string;

  @ApiProperty({
    description: '게시판 설명',
    type: String,
    example: '자유롭게 글을 쓸 수 있는 게시판입니다.',
  })
  description: string;
}
