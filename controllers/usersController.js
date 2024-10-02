const express = require('express');
const knex = require('knex')(require('../db/knexfile.js'));
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');
const ErrorHandler = require('../utils/errorHandler');

exports.registerUser = async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const newUser = {
        email,
        password,
        name
      };
      newUser.password = await bcrypt.hash(password, 10);
  
      await knex('users').insert(newUser);
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      res.status(500).send('');
    }
  };


//   exports.loginUser = catchAsyncErrors( async( req,res,next) => {
//     const { email, password } = req.body

//     //check if email and pasword is entered by user 
//     if (!email || !password){
//         return next(new ErrorHandler('Please enter valid email $ password', 400));
//     }
//     //finding user in DB
//     const user = await User.findOne({ email }).select('+password');

//     if (!user) {
//         return next(new ErrorHandler('Invalid email or password', 401));
//     }
     
//     //checks if password is correct
//     const isPasswordMatched = await user.comparePassword(password);
//     if (!isPasswordMatched){
//         return next(new ErrorHandler('Invalid email or password', 401));
//     };

//     sendToken(user, 200, res)
// });
