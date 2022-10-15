import { InjectRedis } from '@nestjs-modules/ioredis';
import { InjectModel } from '@nestjs/sequelize';
import { Redis } from 'ioredis';
import { Sequelize } from 'sequelize-typescript';
import { BoardDto } from './dto/board.dto';
import { Board } from './entities/board.entity';

export class BoardService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @InjectModel(Board) private readonly boardModel: typeof Board,
    private readonly sequelize: Sequelize,
  ) {
    this.sequelize.addModels([Board]);
  }

  async getBoard(): Promise<BoardDto[]> {
    const cacheKey = 'board';
    const cacheValue = await this.redisClient.get(cacheKey);
    if (cacheValue) {
      return JSON.parse(cacheValue);
    }

    const board = await this.boardModel.findAll({
      attributes: ['id', 'title', 'description', 'createdAt', 'updatedAt'],
    });

    await this.redisClient.set(cacheKey, JSON.stringify(board), 'EX', 60 * 60);
    return board;
  }

  async getBoardById(id: number): Promise<BoardDto> {
    const cacheKey = `board:${id}`;
    const cacheValue = await this.redisClient.get(cacheKey);
    if (cacheValue) {
      return JSON.parse(cacheValue);
    }

    const board = await this.boardModel.findOne({
      where: { id },
      attributes: ['id', 'title', 'description', 'createdAt', 'updatedAt'],
    });

    await this.redisClient.set(cacheKey, JSON.stringify(board), 'EX', 60 * 60);
    return board;
  }
}
