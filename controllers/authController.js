const express = require('express');
const db = require('../db/db.js');
const Joi = require('joi');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../middlewares/errors.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');
const { jwtTokens } = require('../utils/jwtToken.js');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/sendEmail.js');

exports.registerUser = async (req, res) => {
  const { email, password, username } = req.body;
  console.log(req.body);

  const validate = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'string.required': 'Email is required',
    }),
    password: Joi.string()
      .required()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      )
      .messages({
        'string.required': 'Password is required',
        'string.regex':
          'Password must contain at least 1 digit, 1 special character, and 1 lowercase letter and 1 uppercase letter',
      }),
    username: Joi.string().required().min(3).messages({
      'string.required': 'Username is required',
      'string.min': 'Username must have a minimum of 3 characters',
    }),
  });
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
    // return res.status(201).json({
    //   message: 'Registration successful!',
    // });
    await sendEmail({
      email: newUser.email,
      subject: 'Login successful!',
      message: 'Welcome to your todo page',
    });
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
  //validate email input
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

    if (!user) {
      return next(new ErrorHandler('User not found with this email', 404));
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return next(new ErrorHandler('Internal server error', 500));
  }

  // Generate reset token (implement your preferred token generation logic)
  const resetToken = jwtTokens(user).refreshToken;
  res.cookie('refresh_token', resetToken, { httpOnly: true });
  console.log(jwtTokens(user));
  res.json(jwtTokens(user));

  // Create reset password URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

  // Update user's reset password token and expiration in the database
  try {
    await req
      .db('users')
      .where('id', user.id)
      .update({
        reset_password_token: resetToken,
        reset_password_expire: Date.now() + 3600000,
      });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler('Internal server error', 500));
  }

  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

  // Send email using Nodemailer
  try {
    await sendEmail({
      email: user.email,
      subject: 'Todo Password Recovery',
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    // Reset user's password reset data if email sending fails
    await req.db('users').where('id', user.id).update({
      reset_password_token: null,
      reset_password_expire: null,
    });
    return next(new ErrorHandler('Error sending email', 500));
  }
});

//Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordTokenHash = await bcrypt.hash(req.params.token, 10);

  const user = await req
    .db('users')
    .where({
      reset_password_token: resetPasswordTokenHash,
      reset_password_expire: {
        '>': Date.now(),
      },
    })
    .first();

  if (!user) {
    return next(
      new ErrorHandler('Password token is Invalid or has expired', 400),
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.reset_password_token = null;
  user.reset_password_expire = null;

  await req.db('users').where({ id: user.id }).update(user);

  sendToken(user, 200, res);
});
