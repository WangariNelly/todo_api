const express = require('express');
const authRouter = express.Router();

const {
  registerUser,
  loginUser,
  refreshedToken,
  logout,
} = require('../controllers/authController.js');
const { AuthenticateToken } = require('../middlewares/authentication.js');
const { getAllUsers } = require('../controllers/usersController.js');

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/users', AuthenticateToken, getAllUsers);
authRouter.get('/logout', AuthenticateToken, logout);
authRouter.get('/refreshToken', refreshedToken);

module.exports = authRouter;
