const express = require('express');
const Joi = require('joi');
const ErrorHandler = require('../middlewares/errors.middleware.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.middleware.js');
const { jwtTokens, setToken } = require('../utils/jwtToken.utils.js');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail.utils.js');
const validate = require('../validations/input.validations.js');
const { comparePassword, hashPassword } = require('../utils/passwordHash.utils.js');

exports.registerUser = catchAsyncErrors(async (req, res) => {
  const { email, password, username } = req.body;
  const { error } = validate.validate(req.body);

  if (error) {
    return next(ErrorHandler(error.message, 400));
  }

  const newUser = {
    email,
    password,
    username,
  };
  newUser.password = await hashPassword(password);
  await req.db('users').insert(newUser);

  await sendEmail({
    email: newUser.email,
    subject: 'Login successful!',
    message: 'Welcome to your todo page',
  });

  return res.status(201).json({
    success: true,
    message: 'User successfully registered!',
  });
});

//LOGIN
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Please enter a valid email and password!' });
  }
  const user = await req
    .db('users')
    .select('email', 'password')
    .where('email', email)
    .first();

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  await comparePassword(password, user.password);
  return setToken(user, res);
});

//refresh token
exports.refreshedToken = catchAsyncErrors(async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ error: 'Not refreshed' });
  }

  await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, user) => {
      if (error) return res.status(403).json({ error: error.message });
      return setToken(user, res);
    },
  );
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('tokens', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'Logged Out',
  });
});
