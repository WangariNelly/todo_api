const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Too many requests from this IP, Please try again later',
  },
  headers: true,
});

module.exports = limiter;
