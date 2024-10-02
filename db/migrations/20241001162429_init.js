
// migrations/create_users_table.js
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('email').unique().notNullable();

    table.string('password').notNullable();
    table.timestamps(true,true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users'); 
};

 // migrations/create_todos_table.js
 exports.up = function(knex) {
  return knex.schema.createTable('todos', table => {
    table.increments('id').primary();
    table.string('task');
    table.boolean('completed').defaultTo(false);
    table.integer('user_id').references('id').inTable('users');
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('todos')
}