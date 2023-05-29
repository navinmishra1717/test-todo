import { BadRequestException, HttpException, NotFoundException } from 'src/exceptions';
import { SubtaskDto, SubtaskFillable, SubtaskStatus, SubtaskStatusUpdatable } from 'src/model/subtask/types';
import TodoService from '../../services/todo';
import SubtaskRepository from '../../repositories/subtask';
import TodoRepository from '../../repositories/todo';
import { TodoStatus } from 'src/model/todo/types';

class SubtaskService {
  private subtask = SubtaskRepository;
  private todo = TodoRepository;

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
    todo.status = TodoStatus.pending;
    await todo.save();
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
    const todo = await this.todo.findOneById(subtask.todoId);
    if (todo) {
      const isPending = todo?.subtasks?.find((t) => t.status === SubtaskStatus.pending);

      if (todo?.status === TodoStatus.completed && isPending) {
        todo.status = TodoStatus.pending;
      }
      if (todo?.status === TodoStatus.pending && !isPending) {
        todo.status = TodoStatus.completed;
      }
      await todo.save();
    }

    return subtask.toDto();
  }
}

export default new SubtaskService();
