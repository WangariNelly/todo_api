const todoApiFeatures = require('../utils/apiFeatures.utils.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.middleware.js');
const ErrorHandler = require('../middlewares/errors.middleware.js');

//create new todos
exports.createTodo = catchAsyncErrors(async (req, res, next) => {
  const { task, completed, user_id } = req.body;
  const existingTodo = await req.db('todos').where({ task, user_id }).first();

  if (existingTodo) {
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

  const todoId = await req.db('todos').orderBy('id', 'desc').first();
  res.status(201).json({
    success: true,
    message: 'Todo created successfully!',
    todo_id: todoId,
  });
  console.log("Created")
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

//mark task as complete
exports.markComplete = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTask = await req
      .db('tasks')
      .where('id', id)
      .update({ completed: true });

    if (updatedTask) {
      res.status(200).json({
        success: true,
        message: 'Task marked as complete',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
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
