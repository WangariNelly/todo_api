const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379,
});

client.on('connect', () => {
  console.log('Redis connected');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});


const cacheMiddleware = (req, res, next) => {
  const cacheKey = `todos_${req.method}_${req.url}_${JSON.stringify(req.query)}`;

  client.get(cacheKey, (err, cachedData) => {
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

module.exports = cacheMiddleware;
