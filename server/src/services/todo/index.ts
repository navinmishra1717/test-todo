import { HttpException, NotFoundException } from 'src/exceptions';
import { TodoDto, TodoFillable, TodoStatus, TodoStatusUpdatable } from 'src/model/todo/types';
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

  /**
   * @description get todo by id
   * @param {number} id ID of the todo
   * @returns {Promise<>}
   */
  async getTodoById(id: number) {
    const todos = await this.todo.findByPk(id);
    return todos;
  }

  /**
   * @description update todo status
   * @param {number} id id of todo
   * @param {TodoStatusUpdatable} data data for todo status update
   * @returns {Promise<TodoDto>}
   */
  async updateStatus(id: number, data: TodoStatusUpdatable): Promise<TodoDto> {
    const { status } = data;
    const todo = await this.todo.findOneById(id);
    if (!todo) {
      throw new NotFoundException('Todo Not found');
    }
    todo.status = status;
    await todo.save();
    return todo.toDto();
  }
}

export default new TodoService();
