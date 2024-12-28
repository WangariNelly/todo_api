const bcrypt = require('bcryptjs');
const ErrorHandler = require('./errorHandler.utils.js');

async function hashPassword(password) {
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt).catch(() => {
    throw new ErrorHandler('Password hashing failed!', 500);
  });

  return hashedPassword;
}

//Password compare
async function comparePassword(enteredPassword, storedHashedPassword) {
  try {
    const isPasswordMatched = await bcrypt.compare(
      enteredPassword,
      storedHashedPassword,
    );

    if (!isPasswordMatched) {
      throw new ErrorHandler('Invalid email or password', 401);
    }
  } catch (error) {
    throw new ErrorHandler('Error comparing passwords', 500);
  }
}

module.exports = {
  comparePassword,
  hashPassword,
};
