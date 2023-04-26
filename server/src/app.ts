import express, { Application } from 'express';
import { applyMiddleware } from './bootstrap/middleware';
import { HttpException } from './exceptions';
import errorHandler from './bootstrap/middleware/error-handler';

const app: Application = express();

const App = async (): Promise<Application> => {
  try {
    await applyMiddleware(app);
    app.use(errorHandler);
    return app;
  } catch (e: any) {
    throw new HttpException(`Error while starting the server : ${e.message}`);
  }
};

export default App;
