import { InferAttributes, InferCreationAttributes } from 'sequelize';
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
      // include: [
      //   {
      // model: Subtask,
      // as: 'subtask',
      // attributes: ['id', 'title', 'status', 'createdAt'],
      //   },
      // ],
    });
  }

  async getAll(limit?: number, offset?: number) {
    return this.findAndCountAll({
      distinct: true,
      where: {},
      attributes: ['id', 'title', 'status', 'createdAt'],
      // include: [
      //   {
      // model: Subtask,
      // as: 'subtask',
      // attributes: ['id', 'title', 'status', 'createdAt'],
      //   },
      // ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      subQuery: false,
    });
  }
}

export default new TodoRepository();
