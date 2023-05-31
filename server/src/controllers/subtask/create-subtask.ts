import { NextFunction, Request, Response } from 'express';
import { ValidationException } from 'src/exceptions';
import SubtaskService from 'src/services/subtask';
import { sanitize, SanitizeType } from 'src/utils/sanitize';

function validateCreateSubtaskRequest(req: Request) {
  const { title, todoId } = req.body;
  if (!title) {
    throw new ValidationException('Title is required');
  }
  if (!todoId) {
    throw new ValidationException('TodoId is required');
  }
  return {
    title: sanitize(title, [SanitizeType.trim]),
    todoId: Number(todoId),
  };
}

export async function createSubtask(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, todoId } = validateCreateSubtaskRequest(req);
    const subtask = await SubtaskService.create({ title, todoId });
    res.json({
      data: subtask,
      status: 'ok',
    });
  } catch (error: any) {
    next(error);
  }
}
