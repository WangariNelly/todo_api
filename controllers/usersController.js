const express = require('express');
const db = require('../db/db.js');

exports.registerUser = async (req, res) => {
  const { email, password, name } = req.body;
  console.log(req.body);
  try {
    const newUser = {
      email,
      password,
      name,
    };
    // newUser.password = await bcrypt.hash(password, 10);

    await req.db('users').insert(newUser);
    return res.status(201).json({
      message: 'ok!',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error"
    });
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
