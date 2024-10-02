
const knex = require('knex');
// const knexfile = require('./knexfile.js');

// const dbConnection = knex(knexfile.development);

// module.exports = dbConnection;
const db = knex({
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
});

module.exports = db;