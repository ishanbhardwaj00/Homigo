import jwt from 'jsonwebtoken';

const verifyJwt = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    console.log('Access token not found');
    return res.status(401).send('<h1>You are not authorized to see this</h1>');
  }

  try {
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      console.log('Invalid token');
      return res.status(401).send('<h1>You are not authorized to see this</h1>');
    }

    req.decodedToken = decodedToken;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).send('<h1>You are not authorized to see this</h1>');
  }
};

export default verifyJwt;
