require('dotenv').config({ path: '/config/.env' });

const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');

const usersRoute = require('./routes/authRoute.js');
const db = require('./db/db.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/errors');
const swaggerDefinition = require('./swagger.json');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.db = db; // Add db to request object
  next(); // Move to the next middleware/route handler
});
const baseUrl = '/api/v1';

app.use(baseUrl, usersRoute);

app.use(
  baseUrl + '/swagger',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDefinition),
);

// app.get('/users', async (req, res) => {
//   try {
//       const users = await req.db('users').select('*');
//       res.json(users);
//   } catch (error) {
//       console.error('Error fetching users:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
app.use(errorMiddleware);

module.exports = app;
