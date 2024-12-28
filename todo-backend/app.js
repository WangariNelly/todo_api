require('dotenv').config({ path: '/config/.env' });
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

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

// const corsOptions = {
//   origin: 'http://localhost:4200',  // Allow requests only from this origin
//   methods: 'GET,POST,PUT,DELETE',  // Allow specific methods
//   allowedHeaders: 'Content-Type',  // Allow specific headers
// };

// app.use(cors());
app.use(cors( 'origin *'));

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/api/todos', cacheMiddleware);

const baseUrl = '/api/v1';

app.use(baseUrl  + '/auth' , authRoutes);
app.use(baseUrl  + '/tasks' , taskRoutes);
app.use(baseUrl + '/password' , passwordRoutes);

app.use(
  baseUrl + '/swagger',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDefinition),
);

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, 'todo-frontend/dist')));

// Catch-all route to serve Angular app for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'todo-frontend/dist/index.html'));
});


app.use(errorMiddleware);

module.exports = app;
