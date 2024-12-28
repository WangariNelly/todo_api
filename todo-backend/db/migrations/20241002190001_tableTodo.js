/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('todos', (table) => {
    table.increments('id').primary();
    table.string('task');
    table.boolean('completed').defaultTo(false);
    table.integer('user_id').references('id').inTable('users');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('todos');
};
