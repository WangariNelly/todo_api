require('dotenv').config({ path: '/config/.env' });
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth.route.js');
const taskRoutes = require('./routes/task.routes.js');
const passwordRoutes = require('./routes/password.route.js');
const db = require('./db/db.js');
const errorMiddleware = require('./middlewares/errors.middleware.js');
const swaggerDefinition = require('./swagger.json');
const cacheMiddleware = require('./middlewares/redis.middleware.js');
const limiter = require('./middlewares/rate_limiter.middleware.js');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(limiter);

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/api/todos', cacheMiddleware);

const baseUrl = '/api/v1';

app.use(baseUrl,  + '/auth' + authRoutes);
app.use(baseUrl,  + '/tasks' + taskRoutes);
app.use(baseUrl, + '/password' + passwordRoutes);

app.use(
  baseUrl + '/swagger',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDefinition),
);

app.use(errorMiddleware);

module.exports = app;
