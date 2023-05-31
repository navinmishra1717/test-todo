import { NextFunction, Request, Response } from 'express';
import TodoService from '../../services/todo';

export async function getTodos(req: Request, res: Response, next: NextFunction) {
  try {
    const { count, rows } = await TodoService.getTodos();
    res.json({
      data: {
        total: count,
        items: rows,
      },
      status: 'ok',
    });
  } catch (error: any) {
    next(error);
  }
}
