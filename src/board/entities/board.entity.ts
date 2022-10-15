import {
  Column,
  DataType,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { BoardDto } from '../dto/board.dto';
import { CreateBoardDto } from '../dto/create-board.dto';

@Table({
  tableName: 'board',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Board extends Model<BoardDto, CreateBoardDto> {
  @Column({
    field: 'id',
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id: number;

  @Column({
    field: 'title',
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  @Column({
    field: 'description',
    type: DataType.STRING(255),
    allowNull: false,
  })
  description: string;

  @Column({
    field: 'created_at',
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  createdAt: Date;

  @Column({
    field: 'updated_at',
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  updatedAt: Date;
}
