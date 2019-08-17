import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Sequelize,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table
class Comment extends Model<Comment> {

  @Default(Sequelize.UUIDV4)
  @Unique
  @PrimaryKey
  @Column(DataType.UUID)
  public id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public organization: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public message: string;
}

export {
  Comment,
};
