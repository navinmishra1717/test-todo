import { NextFunction, Request, Response } from 'express';

export async function getTodos(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      data: [
        {
          title: 'test 1',
          status: 'pending',
          createdAt: new Date(),
        },
        {
          title: 'test 2',
          status: 'completed',
          createdAt: new Date(),
        },
      ],
      status: 'ok',
    });
  } catch (error: any) {
    throw error;
  }
}
