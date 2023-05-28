import { BadRequestException, HttpException, NotFoundException } from 'src/exceptions';
import { SubtaskDto, SubtaskFillable, SubtaskStatus, SubtaskStatusUpdatable } from 'src/model/subtask/types';
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

  /**
   * @description update subtask status
   * @param {number} id id of subtask
   * @param {SubtaskStatusUpdatable} data data for subtask status update
   * @returns {Promise<TodoDto>}
   */
  async updateStatus(id: number, data: SubtaskStatusUpdatable): Promise<SubtaskDto> {
    const { status } = data;
    const subtask = await this.subtask.findOneById(id);
    if (!subtask) {
      throw new NotFoundException('Subtask Not found');
    }
    subtask.status = status;
    await subtask.save();
    return subtask.toDto();
  }
}

export default new SubtaskService();
