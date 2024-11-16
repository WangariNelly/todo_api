// migrations/create_users_table.js
exports.up = function (knex) {
    return knex.schema.hasTable('todos').then(function(exist) {
        if(!exist) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('email').unique().notNullable();
  
      table.string('password').notNullable();
      table.timestamps(true, true);
    });
    }
  })
};
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users');
  };
  
  // migrations/create_todos_table.js
  