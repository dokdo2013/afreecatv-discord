import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';

@Controller('board')
@ApiTags('Board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('')
  @ApiOperation({ summary: '게시판 리스트 조회' })
  async getBoard(): Promise<BoardDto[]> {
    return await this.boardService.getBoard();
  }

  @Get(':id')
  @ApiOperation({ summary: '게시판 개별 조회' })
  @ApiParam({
    name: 'id',
    description: '게시판 ID',
    type: Number,
    example: 1,
  })
  async getBoardById(@Param('id') id: number): Promise<BoardDto> {
    return await this.boardService.getBoardById(id);
  }
}
