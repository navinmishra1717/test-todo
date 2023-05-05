import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from 'src/bootstrap/sequelize';
import Todo from '../todo';
import { SubtaskDto, SubtaskStatus } from './types';

class Subtask extends Model<InferAttributes<Subtask>, InferCreationAttributes<Subtask>> {
  declare id: CreationOptional<number>;

  declare title: string;

  declare todoId: number;

  declare status: CreationOptional<SubtaskStatus>;

  declare readonly createdAt: CreationOptional<Date>;

  declare readonly updatedAt: CreationOptional<Date>;

  public toDto(): SubtaskDto {
    const data: SubtaskDto = {
      id: this.id,
      title: this.title,
      status: this.status,
      createdAt: this.createdAt,
    };
    return data;
  }
}

Subtask.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    todoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(SubtaskStatus.pending, SubtaskStatus.completed),
      defaultValue: SubtaskStatus.pending,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'Subtasks',
  }
);

// define associations
Subtask.belongsTo(Todo, {
  foreignKey: 'todoId',
  as: 'todo',
});

Todo.hasMany(Subtask, {
  foreignKey: 'todoId',
  as: 'subtasks',
});

export default Subtask;
