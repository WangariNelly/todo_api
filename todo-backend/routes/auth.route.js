const express = require('express');
const authRouter = express.Router();

const {
  registerUser,
  loginUser,
  refreshedToken,
  logout,
} = require('../controllers/auth.controller.js');
const { AuthenticateToken } = require('../middlewares/authentication.middleware.js');
const { getAllUsers } = require('../controllers/users.controller.js');

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/users', AuthenticateToken, getAllUsers);
authRouter.get('/logout', AuthenticateToken, logout);
authRouter.get('/refreshToken', refreshedToken);

module.exports = authRouter;
