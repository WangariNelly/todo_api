const express = require('express');
const db = require('../db/db.js');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../middlewares/errors.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');
const { jwtTokens } = require('../utils/jwtToken.js');
const { sendWelcomeEmail } = require('../utils/emailMessage.js');

exports.registerUser = async (req, res) => {
  const { email, password, username } = req.body;
  console.log(req.body);

  //validate data entered
  const validate = require('joi').object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    username: Joi.string().required(),
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
    // const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // const newUser = await db.queryBuilder(
    //   'INSERT INTO users (email,password,username) VALUES(&1,&2&3) RETURNING *',
    //   [req.body.username, req.body.email,hashedPassword]
    // );
    // res.json({ users: newUser.rows[0]})
    await req.db('users').insert(newUser);
    return res.status(201).json({
      // message: 'Successfully created!',
      sendWelcomeEmail,
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
      return res.status(401).json({ error: 'Incorrect password!' });
    }
    // return res.status(200).json('Success!');
    //jwt
    let tokens = jwtTokens(user);
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
    res.json(tokens);
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Forgot password
