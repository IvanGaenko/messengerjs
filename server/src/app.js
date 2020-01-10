import express from 'express';
import loader from './loaders/express';
import config from './config';

async function startServer() {
  const app = express();

  loader(app);

  app.listen(config.port, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Server running at ${config.port}`);
  });
}

startServer();
