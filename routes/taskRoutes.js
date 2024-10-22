const express = require('express');
const taskRouter = express.Router();

const {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  markComplete,
} = require('../controllers/tasksController.js');

const { AuthenticateToken } = require('../middlewares/authentication.js');

taskRouter.post('/new/todo', AuthenticateToken, createTodo);
taskRouter.get('/fetch/todos', AuthenticateToken, getTodos);
taskRouter.get('/fetch/todo/:id', AuthenticateToken, getTodo);
taskRouter.put('/update/todo/:id', AuthenticateToken, updateTodo);
taskRouter.delete('/delete/todo/:id', AuthenticateToken, deleteTodo);
taskRouter.patch('/tasks/:id/complete', AuthenticateToken, markComplete);

module.exports = taskRouter;
