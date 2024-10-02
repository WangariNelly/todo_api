require("dotenv").config({ path: "/config/.env" });
const express = require('express');
const app = express();
const usersRoute = require('./routes/usersRoute.js');
const db = require('./db/db.js');
const bodyParser = require('body-parser');


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
// const cookieParser = require('cookie-parser');
// app.use(db);

app.use((req, res, next) => {
    req.db = db;  // Add db to request object
    next();  // Move to the next middleware/route handler
  });

  app.use('/api/v1', usersRoute);
// app.get('/', (res,req) => {
//     console.log('Fetching...')
// })


//routes



module.exports = app;