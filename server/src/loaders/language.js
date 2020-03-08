// App Imports
import { language } from '../config/env';

// Language middleware
export default async function(req, res, next) {
  let header = req.headers.language;

  if (header && header !== null) {
    req.language = header;
  } else {
    req.language = language.default;
  }

  next();
}
