require('dotenv').config({ path: './config/.env' });

const app = require('./app');

app.listen(process.env.PORT, () => {
  console.log(
    `Server running on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`,
  );
});
