const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  refreshedToken,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController.js');
const { AuthenticateToken } = require('../middlewares/authentication.js');
const { getAllUsers } = require('../controllers/usersController.js');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/users').get(AuthenticateToken, getAllUsers);
router.route('/logout').get(AuthenticateToken, logout);
router.route('/refreshToken').get(refreshedToken);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

module.exports = router;
