import { findUser } from '../services/account.service';
import GlobalError from '../lib/GlobalError';
import { comparePassword } from '../lib/passwordOp';

const loginAuth = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('email, password', email, password);
  const user = await findUser(email);

  if (!user) {
    return next(new GlobalError('Invalid credential', 400));
  }

  if (!(await comparePassword(password, user.password))) {
    return next(new GlobalError('Invalid credential', 400));
  }

  req.body.user = user.toJSON();
  next();
};

export default loginAuth;
