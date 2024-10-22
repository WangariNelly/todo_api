const express = require('express');
const passwordRouter = express.Router();

const {
  forgotPassword,
  resetPassword,
} = require('../controllers/passwordController.js');

passwordRouter.post('/password/forgot', forgotPassword);
passwordRouter.put('/password/reset/:token', resetPassword);

module.exports = passwordRouter;
