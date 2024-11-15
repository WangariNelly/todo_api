// exports.up = function (knex) {
//   return knex.schema.createTable('todos', (table) => {
//     table.increments('id').primary();
//     table.string('task');
//     table.boolean('completed').defaultTo(false);
//     table.integer('user_id').references('id').inTable('users');
//     table.timestamps(true, true);
//   });
// };

// exports.down = function (knex) {
//   return knex.schema.dropTable('todos');
// };


exports.up = function(knex) {
  return knex.schema.hasTable('todos').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('todos', function(table) {
        table.increments('id').primary();
        table.string('task', 255);
        table.boolean('completed').defaultTo(false);
        table.integer('user_id');
        table.timestamps(true, true);
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('todos');
};
