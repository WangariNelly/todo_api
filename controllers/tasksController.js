const db = require('../db/db.js');
const todoApiFeatures = require('../utils/apiFeatures.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');
const ErrorHandler = require('../middlewares/errors.js');
const limiter = require('../middlewares/rate_limiter');

//create new todos
exports.createTodo = catchAsyncErrors(async (req, res, next) => {
  // limiter(req,res,next, async() => {
  const existingTodo = await req.db.raw(
    'SELECT EXISTS(SELECT 1 FROM todos WHERE task = ? AND user_id = ?)',
    [req.body.task, req.body.user_id],
  );

  if (existingTodo.rows[0].exists) {
    return res.status(400).json({
      success: false,
      message: 'Todo with the same task and user already exists.',
    });
  }
  await req.db.raw('CALL create_todo(?, ?, ?)', [
    req.body.task,
    req.body.completed,
    req.body.user_id,
  ]);
  const todoId = await req.db.raw('SELECT lastval() AS todo_id');

  res.status(201).json({
    success: true,
    message: 'Todo created successfully!',
    todo_id: todoId.rows[0].todo_id,
  });
});
// });

// Get all Todos
exports.getTodos = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 5;
  const todoFeatures = new todoApiFeatures(req.db('todos'), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const todos = await todoFeatures.query;

  res.status(200).json({
    success: true,
    todos,
  });
});

// Get a specific Todo by ID
exports.getTodo = catchAsyncErrors(async (req, res, next) => {
  const todo = await req.db('todos').where('id', req.params.id).first();

  if (!todo) {
    return next(new ErrorHandler('Todo not found', 404));
  }

  res.status(200).json({
    success: true,
    todo,
  });
});

// Update a Todo by ID
exports.updateTodo = catchAsyncErrors(async (req, res, next) => {
  const todo = await req.db('todos').where('id', req.params.id).first();

  if (!todo) {
    return next(new ErrorHandler('Todo not found', 404));
  }

  const updatedTodo = await req
    .db('todos')
    .where('id', req.params.id)
    .update(req.body)
    .returning('*');

  res.status(200).json({
    success: true,
    message: 'Todo updated successfully',
    todo: updatedTodo[0],
  });
});

exports.deleteTodo = catchAsyncErrors(async (req, res, next) => {
  const todo = await req.db('todos').where('id', req.params.id).first();

  if (!todo) {
    return next(new ErrorHandler('Todo not found', 404));
  }

  await req.db('todos').where('id', req.params.id).del();

  res.status(200).json({
    success: true,
    message: 'Todo deleted successfully',
  });
});
