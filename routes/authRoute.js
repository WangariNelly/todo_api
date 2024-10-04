const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  refreshedToken,
  logout,
} = require('../controllers/authController.js');
const { AuthenticateToken } = require('../middlewares/authentication.js');
const { getAllUsers } = require('../controllers/usersController.js');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/users').get(AuthenticateToken, getAllUsers);
router.route('/logout').get(logout);
router.route('/refreshToken').get(refreshedToken);

module.exports = router;
