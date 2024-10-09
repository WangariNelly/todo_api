const express = require('express');
const db = require('../db/db.js');
const Joi = require('joi');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../middlewares/errors.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');
const { jwtTokens } = require('../utils/jwtToken.js');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail.js');
const validate = require('../validations/inputValidations.js');

exports.registerUser = async (req, res) => {
  const { email, password, username } = req.body;
  // console.log(req.body);

  const { error } = validate.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  try {
    const newUser = {
      email,
      password,
      username,
    };
    newUser.password = await bcrypt.hash(password, 10);
    await req.db('users').insert(newUser);
    console.log('Sending email to:', newUser.email);

    await sendEmail({
      email: newUser.email,
      subject: 'Login successful!',
      message: 'Welcome to your todo page',
    });
    console.log('Email sent!');
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

//LOGIN
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check if email and pasword is entered by user
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
    //checks user exist
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email!' });
    }
    //password check
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }
    // return res.status(200).json('Success!');
    //jwt
    let tokens = jwtTokens(user);
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
    console.log(tokens);
    res.json(tokens);
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//refresh token
exports.refreshedToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    console.log(refreshToken);
    if (!refreshToken) {
      return res.status(401).json({ error: 'Not refreshed' });
    }
    await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, user) => {
        if (error) return res.status(403).json({ error: error.message });
        let tokens = jwtTokens(user);
        res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
        res.json(tokens);
      },
    );
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

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

//forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  // Validate email input
  const validate = Joi.object({
    email: Joi.string().email().required(),
  });
  const { error } = validate.validate(req.body);
  if (error) {
    return res.status(401).json({ Error: ' Enter a valid email! ' });
  }

  // Query user by email using Knex
  try {
    const user = await req.db('users').where('email', email).first();
    console.log('Queried User:', user);
    if (!user) {
      return next(new ErrorHandler('User not found with this email', 404));
    }

    // Generate reset token using JWT
    const resetToken = jwtTokens(user).refreshToken;
    console.log('Generated resetToken:', resetToken);

    // Create reset password URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    console.log('Reset URL:', resetUrl);

    // Update user's reset password token and expiration in the database
    await req
      .db('users')
      .where('id', user.id)
      .update({
        reset_password_token: resetToken,
        reset_password_expire: new Date(Date.now() + 3600000),
      });
    console.log('Token updated in the database');

    // Create message and send email using Nodemailer
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
    await sendEmail({
      email: user.email,
      subject: 'Todo Password Recovery',
      message,
    });
    console.log('Email sent to:', user.email);

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    console.error('Error in forgotPassword flow:', error);
    return next(new ErrorHandler('Internal server error', 500));
  }
});

//Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  console.log('Received the token..', token);

  const user = await req
    .db('users')
    .where('reset_password_token', token)
    .andWhere('reset_password_expire', '>', Date.now())
    .first();

  console.log(user);

  if (!user) {
    return next(
      new ErrorHandler('Password token is Invalid or has expired', 400),
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }

  const newPassword = await bcrypt.hash(req.body.password, 10);

  await req.db('users').where({ id: user.id }).update({
    password: newPassword,
    reset_password_token: null,
    reset_password_expire: null,
  });

  console.log('Password updated for user:', user.email);
  sendToken(user, 200, res);
});
