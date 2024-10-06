//create and send token and save inthe cookie
require('dotenv').config({ path: '/config/.env' });
const jwt = require('jsonwebtoken');

function jwtTokens({ id, username, email }) {
  const user = { id, username, email };
  const payload = {
    user: user,
  };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
  return { accessToken, refreshToken };
}

module.exports = { jwtTokens };
