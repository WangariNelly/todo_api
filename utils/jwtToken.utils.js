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

function setToken(user, res) {
  const tokens = jwtTokens(user);
  console.log("Generated Token:", tokens);
  res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
  res.json(tokens);
}

module.exports = { jwtTokens, setToken };
