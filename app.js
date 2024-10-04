require('dotenv').config({ path: '/config/.env' });
const express = require('express');
const app = express();
const usersRoute = require('./routes/authRoute.js');
const db = require('./db/db.js');
const bodyParser = require('body-parser');
// const cookie = require('cookie-parser');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.db = db; // Add db to request object
  next(); // Move to the next middleware/route handler
});

app.use('/api/v1', usersRoute);

// app.get('/users', async (req, res) => {
//   try {
//       const users = await req.db('users').select('*');
//       res.json(users);
//   } catch (error) {
//       console.error('Error fetching users:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

module.exports = app;
