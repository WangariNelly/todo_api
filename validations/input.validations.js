const Joi = require('joi');

const validate = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'string.required': 'Email is required',
  }),
  password: Joi.string()
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .messages({
      'string.required': 'Password is required',
      'string.regex':
        'Password must contain at least 1 digit, 1 special character, and 1 lowercase letter and 1 uppercase letter',
    }),
  username: Joi.string().required().min(3).messages({
    'string.required': 'Username is required',
    'string.min': 'Username must have a minimum of 3 characters',
  }),
});

module.exports = validate;
