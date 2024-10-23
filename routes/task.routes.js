const express = require('express');
const taskRouter = express.Router();

const {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  markComplete,
} = require('../controllers/tasks.controller.js');

const { AuthenticateToken } = require('../middlewares/authentication.middleware.js');

// taskRouter.post('/new/todo', AuthenticateToken, createTodo);
// taskRouter.get('/fetch/todos', AuthenticateToken, getTodos);
// taskRouter.get('/fetch/todo/:id', AuthenticateToken, getTodo);
// taskRouter.put('/update/todo/:id', AuthenticateToken, updateTodo);
// taskRouter.delete('/delete/todo/:id', AuthenticateToken, deleteTodo);
// taskRouter.patch('/tasks/:id/complete', AuthenticateToken, markComplete);


taskRouter.post('/new/todo', createTodo);
taskRouter.get('/fetch/todos', getTodos);
taskRouter.get('/fetch/todo/:id', getTodo);
taskRouter.put('/update/todo/:id',  updateTodo);
taskRouter.delete('/delete/todo/:id', deleteTodo);
taskRouter.patch('/tasks/:id/complete', markComplete);

module.exports = taskRouter;
