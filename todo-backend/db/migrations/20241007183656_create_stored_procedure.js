exports.up = async function (knex) {
  await knex.raw(`
          CREATE PROCEDURE create_todo(
            IN p_task TEXT,
            IN p_completed BOOLEAN,
            IN p_user_id INT
          )
          LANGUAGE plpgsql
          AS $$
          BEGIN
            INSERT INTO todos (task, completed, user_id)
            VALUES (p_task, p_completed, p_user_id);
            
            -- Perform a SELECT to return the last inserted ID
            PERFORM lastval();
          END;
          $$;
        `);
};

exports.down = async function (knex) {
  await knex.raw(`
          DROP PROCEDURE IF EXISTS create_todo;
        `);
};
