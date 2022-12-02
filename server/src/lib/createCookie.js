const createCookie = (res, token, name, maxAge) => {
  const cookieOption = {
    domain: 'localhost',
    httpOnly: true,
    // expires: new Date(Date.now() + expires * 24 * 60 * 60 * 1000),
    maxAge,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    path: '/auth',
    sameSite: 'strict',
    signed: true,
  };

  return res.cookie(name, token, cookieOption);
};

export default createCookie;
