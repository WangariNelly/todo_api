const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  //limit requests per minute
  windowsMs: 1 * 60 * 1000,
  max: 50,
});
