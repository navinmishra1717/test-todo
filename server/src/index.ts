import 'dotenv/config';
import App from './app';
import { APP_PORT } from './config';

(async () => {
  const app = await App();
  app.listen(APP_PORT, async () => {
    console.log(`listening at port:${APP_PORT}`);
  });
})();
