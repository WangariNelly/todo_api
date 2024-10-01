
import knex from 'knex';
import knexfile from './knexfile.js';

const dbConnection = knex(knexfile.development);

export default dbConnection;