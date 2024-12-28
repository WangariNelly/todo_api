exports.up = function (knex) {
  return knex.schema.table('users', function (table) {
    table.string('reset_password_token').nullable();
    table.timestamp('reset_password_expire').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('reset_password_token');
    table.dropColumn('reset_password_expire');
  });
};
