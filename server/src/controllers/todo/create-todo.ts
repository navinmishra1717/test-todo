import { NextFunction, Request, Response } from 'express';

export async function createTodo(req: Request, res: Response, next: NextFunction) {
  try {
    const createdTodo = {
      title: 'test 1',
      status: 'pending',
      createdAt: new Date(),
    };
    // const createdTodo = await TodoService.create(req.body);

    res.json({
      data: createdTodo,
      status: 'ok',
    });
  } catch (error: any) {
    next(error);
  }
}
