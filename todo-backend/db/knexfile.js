require('dotenv').config({ path: '/config/.env' });
const { TableName } = require('pg-promise');

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'todo_db',
      user: 'postgres',
      password: 'Ak0881216',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
