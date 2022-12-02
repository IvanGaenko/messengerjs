import { findUser } from '../services/account.service';
// import GlobalError from '../lib/GlobalError';
import { comparePassword } from '../lib/passwordOp';

const loginAuth = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('email, password', email, password);
  const user = await findUser(email);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Incorrect email or password.',
      data: {},
    });
  }

  if (!(await comparePassword(password, user.password))) {
    // return next(new GlobalError('Incorrect username or password.', 400));
    return res.status(400).json({
      success: false,
      message: 'Incorrect email or password.',
      data: {},
    });
  }

  req.body.user = user.toJSON();
  next();
};

export default loginAuth;
