import express, { Application } from 'express';

const app: Application = express();

const App = async (): Promise<Application> => {
  try {
    return app;
  } catch (e: any) {
    throw new Error(`Error while starting the server : ${e.message}`);
  }
};

export default App;
