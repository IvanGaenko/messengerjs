// Imports
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import Cors from 'cors';

// App Imports
import { corsWhitelist, cookieSecretKey } from '../config/env';
import apiRouter from '../routes';
import corsMiddleware from '../middleware/corsMiddleware';

// Setup middlewares
export default (app, json, urlencoded) => {
  console.info('SETUP - Middlewares..');

  // Enable helmet
  app.use(helmet());

  // Request body parser
  app.use(json());
  app.use(urlencoded({ extended: false }));

  app.use(corsMiddleware());

  app.use(cookieParser(cookieSecretKey));

  // HTTP logger
  app.use(morgan('dev'));

  // Enable CORS
  const corsOptions = {
    origin: (origin, callback) => {
      // console.log('origin', origin);
      if (!origin) return callback(null, true);
      if (corsWhitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
  };

  app.use(Cors(corsOptions));

  app.get('/', async (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'welcome to chat api',
    });
  });

  app.use(apiRouter);

  app.all('*', async (req, res) => {
    res.status(404).json({
      status: 'error',
      message: `${req.originalUrl} does not exist on the server`,
    });
  });
};
