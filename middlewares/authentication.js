const jwt = require('jsonwebtoken');
// const ErrorHandler = require('../utils/errorHandler');

//checks if user is authenticated or not
function AuthenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; //Bearer token
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ error: 'Login first to get access resources!' });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.status(403).json({ error: error.message });
    req.user = user;
    next(); //user in payload
  });
}

module.exports = { AuthenticateToken };
