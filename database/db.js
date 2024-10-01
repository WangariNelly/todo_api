
import knex from 'knex';
import knexfile from './knexfile';

const dbConnection = knex(knexfile.development);

export default dbConnection;