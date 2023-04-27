import { NextFunction, Request, Response } from 'express';
import { ValidationException } from 'src/exceptions';
import { sanitize, SanitizeType } from 'src/utils/sanitize';
import TodoService from '../../services/todo';

function validateCreateTodoRequest(req: Request) {
  const { title } = req.body;
  if (!title) {
    throw new ValidationException('Title is required');
  }
  return {
    title: sanitize(title, [SanitizeType.trim]),
  };
}

export async function createTodo(req: Request, res: Response, next: NextFunction) {
  try {
    const { title } = validateCreateTodoRequest(req);
    const createdTodo = await TodoService.create({
      title,
    });

    res.json({
      data: createdTodo,
      status: 'ok',
    });
  } catch (error: any) {
    next(error);
  }
}
