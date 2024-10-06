const express = require('express');
const router = express.Router();

const {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/tasksController.js');

router.route('/new/todo').post(createTodo);
router.route('/fetch/todos').get(getTodos);
router.route('/fetch/todo/:id').get(getTodo);
router.route('/update/todo/:id').put(updateTodo);
router.route('/delete/todo/:id').delete(deleteTodo);

module.exports = router;
