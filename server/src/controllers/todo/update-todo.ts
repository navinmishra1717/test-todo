import { NextFunction, Request, Response } from 'express';
import { TodoStatus } from 'src/model/todo/types';
import { sanitize, SanitizeType } from 'src/utils/sanitize';
import TodoService from '../../services/todo';
import { ValidationException } from '@app/exceptions';

function validateUpdateTodoStatus(req: Request) {
  const { status } = req.body;

  if (!status) {
    throw new ValidationException('Status is required');
  }
  if (!Object.values(TodoStatus).includes(status)) {
    throw new ValidationException('Invalid status');
  }
  return {
    id: Number(sanitize(req.params.id, [SanitizeType.trim])),
    status,
  };
}

export async function updateTodoStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, status } = validateUpdateTodoStatus(req);

    const updatedTodo = await TodoService.updateStatus(id, { status });

    return res.json({
      data: updatedTodo,
      status: 'ok',
    });
  } catch (error: any) {
    next(error);
  }
}
