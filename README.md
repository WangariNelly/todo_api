## TODO API

This API provides endpoints for creating, retrieving, updating, and deleting todo items. It uses Knex for database interactions, PostgreSQL as the database, Redis for caching, and Joi for input validation.

# Prerequisites:
- Node.js and npm installed
- A PostgreSQL database
- Redis installed and running

# Installation:
- git clone https://github.com/WangariNelly/todo_api.git

## Features:

- CRUD operations: Create, Read, Update, and Delete todos.
- Input validation: Uses Joi for input validation to ensure data integrity.
- Caching: Utilizes Redis for caching frequently accessed data, improving performance.
- Rate limiting: Implements rate limiting to prevent abuse and protect the API.
- Error handling: Provides informative error messages for different scenarios.

## Technologies:

- Node.js and Express
- Knex for database interactions
- PostgreSQL as the database
- Redis for caching
- Joi for input validation
- Async/await for asynchronous operations

## Additional Notes:

- Adjust the database connection details in your .env file to match your PostgreSQL configuration. 

P@ssw0rd!