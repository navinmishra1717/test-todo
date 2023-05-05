import { InferAttributes, InferCreationAttributes } from 'sequelize';
import Subtask from 'src/model/subtask';
import BaseRepository from './base-repository';

class SubtaskRepository extends BaseRepository<InferAttributes<Subtask>, InferCreationAttributes<Subtask>, Subtask> {
  constructor() {
    super(Subtask);
  }

  async findOneById(id: number): Promise<Subtask | null> {
    return this.findOne({
      where: {
        id,
      },
      attributes: ['id', 'title', 'status', 'createdAt'],
    });
  }
}

export default new SubtaskRepository();
