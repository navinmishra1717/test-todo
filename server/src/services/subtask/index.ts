import { BadRequestException, HttpException } from 'src/exceptions';
import { SubtaskDto, SubtaskFillable, SubtaskStatus } from 'src/model/subtask/types';
import SubtaskRepository from '../../repositories/subtask';
import TodoService from '../../services/todo';

class SubtaskService {
  private subtask = SubtaskRepository;

  async create(data: SubtaskFillable): Promise<SubtaskDto> {
    const { title, todoId } = data;
    const todo = await TodoService.getTodoById(todoId);
    if (!todo) {
      throw new BadRequestException('Invalid todo id');
    }
    const { id } = await this.subtask.create({
      title,
      todoId,
      status: SubtaskStatus.pending,
    });
    const subtask = await this.subtask.findOneById(id);
    if (!subtask) {
      throw new HttpException('Subtask not found');
    }
    return subtask.toDto();
  }
}

export default new SubtaskService();
