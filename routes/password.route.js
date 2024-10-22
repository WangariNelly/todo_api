const express = require('express');
const passwordRouter = express.Router();

const {
  forgotPassword,
  resetPassword,
} = require('../controllers/password.controller.js');

passwordRouter.post('/forgot', forgotPassword);
passwordRouter.put('/reset/:token', resetPassword);

module.exports = passwordRouter;
