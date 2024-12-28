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

## Environment Variables

The application requires specific environment variables to be set up for proper functioning. Below are the variables and their purposes:

| **Variable Name**         | **Description**                                  |
|----------------------------|------------------------------------------------|
| `PORT`                    | The port on which the server runs (e.g., 3000). |
| `NODE_ENV`                | The environment mode (e.g., development, production). |
| `ACCESS_TOKEN_SECRET`     | Secret key used for generating access tokens.   |
| `REFRESH_TOKEN_SECRET`    | Secret key used for generating refresh tokens.  |
| `JWT_ACCESS_EXPIRE`       | Expiry duration for JWT access tokens.          |
| `JWT_REFRESH_EXPIRE`      | Expiry duration for JWT refresh tokens.         |
| `SMTP_HOST`               | SMTP server host for sending emails.           |
| `SMTP_PORT`               | SMTP server port for sending emails.           |
| `SMTP_PASSWORD`           | Password for the SMTP server.                   |
| `SMTP_FROM_NAME`          | Sender's name in the email.                     |
| `SMTP_FROM_EMAIL`         | Sender's email address.                         |
| `DB_HOST`                 | Hostname for the database (e.g., localhost).    |
| `DB_USER`                 | Database user name.                             |
| `DB_PASSWORD`             | Password for the database user.                 |
| `DB_NAME`                 | Name of the database.                           |
| `DB_PORT`                 | Port on which the database runs.                |

