import { ApiProperty } from '@nestjs/swagger';

export class BoardDto {
  @ApiProperty({
    description: '게시판 ID',
    type: Number,
    example: 1,
  })
  id: number;

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

  @ApiProperty({
    description: '게시판 생성일',
    type: Date,
    example: '2021-01-01 00:00:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: '게시판 수정일',
    type: Date,
    example: '2021-01-01 00:00:00',
  })
  updatedAt: Date;
}
