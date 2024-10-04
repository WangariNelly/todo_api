const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require('../controllers/usersController.js');
const { AuthenticateToken } = require('../middlewares/authentication.js');
const { getAllUsers } = require('./usersRoute.js');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/users').get(AuthenticateToken, getAllUsers);

module.exports = router;
