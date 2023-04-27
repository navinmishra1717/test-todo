import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import sequelize from 'src/bootstrap/sequelize';
import { TodoDto, TodoStatus } from './types';

class Todo extends Model<InferAttributes<Todo>, InferCreationAttributes<Todo>> {
  declare id: CreationOptional<number>;

  declare title: string;

  declare status: CreationOptional<TodoStatus>;

  declare readonly createdAt: CreationOptional<Date>;

  declare readonly updatedAt: CreationOptional<Date>;

  // declare subtasks?: NonAttribute<Subtask>[];

  // declare getSubtasks: () => Promise<Subtask[]>;

  public toDto(): TodoDto {
    const data: TodoDto = {
      id: this.id,
      title: this.title,
      status: this.status,
      createdAt: this.createdAt,
    };
    return data;
  }
}

Todo.init(
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
    status: {
      type: DataTypes.ENUM(TodoStatus.pending, TodoStatus.completed),
      defaultValue: TodoStatus.pending,
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
    tableName: 'Todos',
  }
);

export default Todo;
