const corsMiddleware = () => (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Origin',
    req.headers.origin || req.headers.host,
  );
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    // eslint-disable-next-line max-len
    'Origin,X-Requested-With,Content-Type,Accept,token,authorization,Authorization',
  );
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  next();
};

export default corsMiddleware;