const express = require('express');
const router = express.Router();

const {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/tasksController.js');

const { AuthenticateToken } = require('../middlewares/authentication.js');
const limiter = require('../middlewares/rate_limiter.js');

router.route('/new/todo').post(AuthenticateToken, limiter, createTodo);
router.route('/fetch/todos').get(AuthenticateToken, limiter, getTodos);
router.route('/fetch/todo/:id').get(AuthenticateToken, limiter, getTodo);
router.route('/update/todo/:id').put(AuthenticateToken, limiter, updateTodo);
router.route('/delete/todo/:id').delete(AuthenticateToken, limiter, deleteTodo);

module.exports = router;
