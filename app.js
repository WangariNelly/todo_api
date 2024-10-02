const express = require('express');
const app = express();

const usersRoute = require('./routes/usersRoute.js')
// const pool = require('./db/db.js');
// const knex = require('knex')(require('./db/knexfile.js'));
// const cookieParser = require('cookie-parser');
app.use(express.json());

// app.use(pool);
//routes
app.use('/api/v1/', usersRoute);


module.exports = app;