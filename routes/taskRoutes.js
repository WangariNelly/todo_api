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

router.route('/new/todo').post(createTodo);
router.route('/fetch/todos').get(getTodos);
router.route('/fetch/todo/:id').get(AuthenticateToken, getTodo);
router.route('/update/todo/:id').put(AuthenticateToken, updateTodo);
router.route('/delete/todo/:id').delete(AuthenticateToken, deleteTodo);

module.exports = router;
