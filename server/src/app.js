import dotenv from 'dotenv';
import express from 'express';
import loader from './loaders/express';

dotenv.config();
const port = process.env.PORT || '3000';

async function startServer() {
  const app = express();

  await loader(app);
  // require('./loaders/express')(app);

  app.listen(port, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Server running at ${port}`);
  });
}

startServer();
