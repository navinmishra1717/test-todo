import { Op } from 'sequelize';
import Todo from '@app/model/todo';
import Subtask from '@app/model/subtask';
import TodoService from '@app/services/todo';
import { TodoDto } from '@app/model/todo/types';

export async function deleteTodo(titles: string[] = ['test todo']) {
  await Todo.destroy({
    where: {
      title: {
        [Op.in]: titles,
      },
    },
    force: true,
  });
}

export async function createTodo(title: string = 'test todo'): Promise<TodoDto> {
  await deleteTodo([title]);
  const todo = await TodoService.create({
    title,
  });
  return todo;
}

export async function deleteSubtask(titles: string[] = ['test subtask']) {
  await Subtask.destroy({
    where: {
      title: {
        [Op.in]: titles,
      },
    },
    force: true,
  });
}
