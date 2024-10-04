const jwt = require('jsonwebtoken');
const User = require('../db/migrations');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');

//checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);
  if (!token) {
    return next(new ErrorHandler('Login first to access resource', 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.username = await User.findById(decoded.id);

  next();
});
