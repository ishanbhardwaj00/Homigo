import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  // Get token from headers, body, or query parameters
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Assuming 'Bearer TOKEN'

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach user data to request object
    req.user = userData;
    next();
  });
};

export default authenticateToken;



//using the middleware crated from above
// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
  });
  