const db = require('../db/db.js');
const todoApiFeatures = require('../utils/apiFeatures.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');
const ErrorHandler = require('../middlewares/errors.js');

//create new todos
exports.createTodo = catchAsyncErrors(async (req, res, next) => {
  const { task, completed, user_id } = req.body;
  const newTodo = await req
    .db('todos')
    .insert({
      task,
      completed,
      user_id,
    })
    .returning('*');
  res.status(201).json({
    success: true,
    message: 'Todo created successfully!',
    todo: newTodo[0],
  });
});

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

// Delete a Todo by ID
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
