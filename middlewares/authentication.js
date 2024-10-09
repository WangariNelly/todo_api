const jwt = require('jsonwebtoken');

function AuthenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; // Bearer token
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      console.log('JWT Verification Error:', error);
      return res.status(403).json({ error: 'Invalid token.' });
    }
    console.log('Decoded User:', user);
    req.user = user;
    next();
  });
}

module.exports = { AuthenticateToken };
