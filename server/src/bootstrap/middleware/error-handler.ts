import { NextFunction, Request, Response } from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || (err.errors && err.errors[0].message) || 'Internal Server Error';
  if (status === 500) {
    console.error(message);
  }
  return res.status(status).json({
    message,
    status: 'error',
  });
};

process.on('unhandledRejection', (err: Error) => {
  console.error(`unhandledRejection: ${err.message} ${err.stack}`);
  process.exit();
});

process.on('uncaughtException', (err: Error) => {
  console.error(`unhandledRejection: ${err.message} ${err.stack}`);
  process.exit();
});

export default errorHandler;
