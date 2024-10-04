const sendEmail = require('./sendEmail.js');

async function sendWelcomeEmail(email) {
  try {
    await sendEmail({
      email,
      subject: 'Login successful!',
      message: `Welcome to your Todo page, ${email}! Get started by creating your first task.`,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

module.exports = { sendWelcomeEmail };
