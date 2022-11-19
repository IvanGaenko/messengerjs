// Imports
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import Cors from 'cors';

// App Imports
import { CORS_whitelist as CORSWhitelist } from '../config/env';
import apiRouter from '../routes';

// Setup middlewares
export default (app, express) => {
  console.info('SETUP - Middlewares..');

  // Enable helmet
  app.use(helmet());

  // Request body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(cookieParser());

  // HTTP logger
  app.use(morgan('dev'));

  // Enable CORS
  const corsOptions = {
    origin: (origin, callback) => {
      console.log('origin', origin);
      if (!origin) return callback(null, true);
      if (CORSWhitelist.indexOf(origin) !== -1) {
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
