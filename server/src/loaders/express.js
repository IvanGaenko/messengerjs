import bodyParser from 'body-parser';
import helmet from 'helmet';
import logger from 'morgan';
import routes from '../api';

export default app => {
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(logger('dev'));

  app.use('/', routes);

  app.get('*', (req, res) =>
    res.status(200).send({
      message: 'Welcome to this API.',
    }),
  );

  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
