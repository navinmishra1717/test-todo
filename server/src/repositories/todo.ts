import { FindAndCountOptions, InferAttributes, InferCreationAttributes, WhereOptions } from 'sequelize';
import Subtask from 'src/model/subtask';
import Todo from 'src/model/todo';
import BaseRepository from './base-repository';

class TodoRepository extends BaseRepository<InferAttributes<Todo>, InferCreationAttributes<Todo>, Todo> {
  constructor() {
    super(Todo);
  }

  async findOneById(id: number) {
    return this.findOne({
      where: {
        id,
      },
      attributes: ['id', 'title', 'status', 'createdAt'],
    });
  }

  async getAll(limit?: number, offset?: number) {
    const whereQuery: WhereOptions = {};
    const findQuery: FindAndCountOptions = {
      where: whereQuery,
      attributes: ['id', 'title', 'status', 'createdAt'],
      include: [
        {
          model: Subtask,
          as: 'subtasks',
          attributes: ['id', 'title', 'status', 'createdAt'],
          order: [['createdAt', 'DESC']],
        },
      ],
      order: [['createdAt', 'DESC']],
    };
    if (limit && offset) {
      findQuery.limit = limit;
      findQuery.offset = offset;
    }
    return this.findAndCountAll({
      distinct: true,
      ...findQuery,
      subQuery: false,
    });
  }
}

export default new TodoRepository();
