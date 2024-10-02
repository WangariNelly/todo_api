
// const knex = require('knex');
// const knexfile = require('./knexfile.js');

// const dbConnection = knex(knexfile.development);

// module.exports = dbConnection;
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.query('SELECT * FROM users', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.rows);
  }
});

module.exports = pool;