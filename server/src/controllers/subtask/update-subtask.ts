import { NextFunction, Request, Response } from 'express';
import { TodoStatus } from 'src/model/todo/types';
import { sanitize, SanitizeType } from 'src/utils/sanitize';
import SubtaskService from '../../services/subtask';

function validateUpdateSubtaskStatus(req: Request) {
  const { status } = req.body;

  if (!status) {
    throw new Error('Status is required');
  }
  if (!Object.values(TodoStatus).includes(status)) {
    throw new Error('Invalid status');
  }
  return {
    id: Number(sanitize(req.params.id, [SanitizeType.trim])),
    status,
  };
}

export async function updateSubtaskStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, status } = validateUpdateSubtaskStatus(req);

    const updatedSubtask = await SubtaskService.updateStatus(id, { status });

    return res.json({
      data: updatedSubtask,
      status: 'ok',
    });
  } catch (error: any) {
    next(error);
  }
}
