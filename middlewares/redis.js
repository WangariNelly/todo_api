const redis = require('redis');
const cache = redis.createClient({
  host: 'localhost',
  port: 6379,
});

cache.on('connect', () => {
  console.log('Redis connected');
});

cache.on('error', (err) => {
  console.error('Redis error:', err);
});

const cacheMiddleware = (req, res, next) => {
  const cacheKey = `todos_${req.method}_${req.url}_${JSON.stringify(req.query)}`;

  cache.get(cacheKey, (err, cachedData) => {
    if (err) {
      console.error('Redis error:', err);
      next();
    } else if (cachedData) {
      res.json(JSON.parse(cachedData));
    } else {
      next();
    }
  });
};

module.exports = { cacheMiddleware };
