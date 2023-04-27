import { HttpException } from 'src/exceptions';
import { TodoDto, TodoFillable, TodoStatus } from 'src/model/todo/types';
import TodoRepository from '../../repositories/todo';

class TodoService {
  private todo = TodoRepository;

  /**
   * @description create todo
   * @param data create todo data
   * @returns {Promise<Todo>}
   */
  async create(data: TodoFillable): Promise<TodoDto> {
    const { title } = data;
    const { id } = await this.todo.create({
      title,
      status: TodoStatus.pending,
    });

    const todo = await this.todo.findOneById(id);
    if (!todo) {
      throw new HttpException('Cannot create todo');
    }
    return todo.toDto();
  }

  /**
   * @description get todo list
   * @returns {Promise<>}
   */
  async getTodos() {
    const todos = await this.todo.getAll();
    return todos;
  }
}

export default new TodoService();
