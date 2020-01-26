// Imports
import bodyParser from 'body-parser';
import helmet from 'helmet';
import logger from 'morgan';
import Cors from 'cors';

// App Imports
import { node_env, CORS_whitelist } from '../config/env';

// Setup middlewares
export default app => {
  console.info('SETUP - Middlewares..');

  // Enable helmet
  app.use(helmet());

  // Request body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // HTTP logger
  if (node_env === 'development') {
    app.use(logger('dev'));
  }

  // Enable CORS
  const corsOptions = {
    origin: (origin, callback) => {
      if (CORS_whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
  };

  app.use(Cors(corsOptions));
};
