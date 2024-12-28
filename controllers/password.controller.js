const express = require('express');
const db = require('../db/db.js');
const Joi = require('joi');
const ErrorHandler = require('../middlewares/errors.middleware.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.middleware.js');
const { jwtTokens } = require('../utils/jwtToken.utils.js');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail.utils.js');
// const validate = require('../validations/input.validations.js');
const sendToken = require('../utils/sendToken.utils.js');
const { hashPassword } = require('../utils/passwordHash.utils.js');

//forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const validate = Joi.object({
    email: Joi.string().email().required(),
  });
  const { error } = validate.validate(req.body);
  if (error) {
    return next(new ErrorHandler('Enter a valid email!', 401));
  }


  const user = await req.db('users').where('email', email).first();
  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404));
  }

  const resetToken = jwtTokens(user).refreshToken;
  // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

  const resetUrl = `http://localhost:4200/reset-password/${resetToken}`;


  await req
    .db('users')
    .where('id', user.id)
    .update({
      reset_password_token: resetToken,
      reset_password_expire: new Date(Date.now() + 3600000),
    });

    
  console.log("yes")

  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
  await sendEmail({
    email: user.email,
    subject: 'Todo Password Recovery',
    message,
  });

  res.status(200).json({
    success: true,
    message: `Email sent to ${user.email}`,
  });
});

//Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;

  const user = await req
    .db('users')
    .where('reset_password_token', token)
    .andWhere('reset_password_expire', '>', Date.now())
    .first();

  if (!user) {
    return next(
      new ErrorHandler('Password token is Invalid or has expired', 400),
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }

  const newPassword = await hashPassword(password);

  await req.db('users').where({ id: user.id }).update({
    password: newPassword,
    reset_password_token: null,
    reset_password_expire: null,
  });

  sendToken(user, 200, res);
});
